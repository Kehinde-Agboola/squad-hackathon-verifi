/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { VendorRepository } from './vendor.repository';
import { CacService } from './cac.service';
import { VerifyVendorDto } from './dto/verify-vendor.dto';
import { VerificationStatus } from './vendor.entity';
import { AddressVerificationService } from './address-verification.service';
import { WalletService } from '../wallets/wallet.service';
import {
  getBankByCode,
  NIGERIAN_BANKS,
  searchBanksByName,
} from 'src/common/constants/banks.constants';

@Injectable()
export class VendorService {
  private readonly logger = new Logger(VendorService.name);

  constructor(
    private readonly vendorRepository: VendorRepository,
    private readonly cacService: CacService,
    private readonly configService: ConfigService,
    private readonly walletService: WalletService,
    private readonly addressVerificationService: AddressVerificationService,
  ) {}

  // ─── Verify Vendor ────────────────────────────────────────────
  async verifyVendor(
    organisationId: string,
    dto: VerifyVendorDto,
    file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('CAC document is required');

    // Resolve bank name from code upfront
    const bank = dto.bankCode ? getBankByCode(dto.bankCode) : null;

    // 1. Create initial vendor record with all submitted details
    const vendor = await this.vendorRepository.create({
      organisationId,
      businessName: dto.businessName,
      businessType: dto.businessType,
      businessDescription: dto.businessDescription,
      street: dto.street,
      city: dto.city,
      state: dto.state,
      bankAccount: dto.bankAccount,
      bankCode: dto.bankCode,
      bankName: bank?.name ?? null,
      contactEmail: dto.contactEmail,
      contactPhone: dto.contactPhone,
      contactPersonName: dto.contactPersonName,
      status: VerificationStatus.PENDING,
    });

    try {
      // 2. Run CAC document extraction + AI validation
      const cacResult = await this.cacService.extractAndValidateCac(
        file.buffer,
        file.mimetype,
        dto.businessName,
      );

      // Guard against total AI failure
      if (!cacResult || (!cacResult.isCacDocument && cacResult.confidenceScore === 0)) {
        throw new BadRequestException(
          'Could not analyse the document. Please upload a clearer image of your CAC certificate.',
        );
      }

      // 3. Address verification — use submitted address if AI didn't extract one
      const addressToVerify =
        cacResult.address ??
        [dto.street, dto.city, dto.state].filter(Boolean).join(', ') ??
        null;

      let addressCheck = {
        performed: false,
        isValid: false,
        confidence: 'low',
        formattedAddress: null as string | null,
        state: null as string | null,
        reason: 'No address provided for verification',
      };

      if (addressToVerify) {
        const addressResult =
          await this.addressVerificationService.verifyAddress(addressToVerify);
        addressCheck = {
          performed: true,
          isValid: addressResult.isValid,
          confidence: addressResult.confidence,
          formattedAddress: addressResult.formattedAddress,
          state: addressResult.state,
          reason: addressResult.reason,
        };
      }

      // 4. Squad account lookup (if bank details provided)
      let bankAccountName: string | null = null;
      let nameMatchScore = 0;
      let squadCheck = { performed: false, passed: false, reason: '' };

      if (dto.bankAccount && dto.bankCode) {
        try {
          const lookupResult = await this.squadAccountLookup(
            dto.bankCode,
            dto.bankAccount,
          );
          bankAccountName = lookupResult.account_name;

          nameMatchScore = this.cacService.fuzzyNameMatch(
            dto.businessName,
            bankAccountName,
          );

          squadCheck = {
            performed: true,
            passed: nameMatchScore >= 70,
            reason:
              nameMatchScore >= 70
                ? `Bank account name "${bankAccountName}" matches business name (${nameMatchScore}% similarity)`
                : `Bank account name "${bankAccountName}" does not match business name "${dto.businessName}" (${nameMatchScore}% similarity)`,
          };
        } catch (err) {
          this.logger.warn(`Squad lookup failed: ${err.message}`);
          squadCheck = {
            performed: true,
            passed: false,
            reason: 'Could not verify bank account — lookup failed',
          };
        }
      }

      // 5. Build full verification checks summary
      const verificationChecks = {
        cacDocument: {
          isCacDocument: cacResult.isCacDocument,
          authenticityReason: cacResult.authenticityReason,
          confidenceScore: cacResult.confidenceScore,
          flags: cacResult.flags ?? [],
          layoutMatchScore: cacResult.layoutMatchScore ?? null,
        },
        extractedFields: {
          businessName: cacResult.extractedBusinessName ?? null,
          rcNumber: cacResult.rcNumber ?? null,
          registrationDate: cacResult.registrationDate ?? null,
          address: cacResult.address ?? null,
          directors: cacResult.directors ?? [],
        },
        submittedDetails: {
          businessName: dto.businessName,
          address: addressToVerify,
          bankName: bank?.name ?? null,
          bankAccount: dto.bankAccount ?? null,
        },
        squadAccountLookup: squadCheck,
        addressVerification: addressCheck,
      };

      // 6. Calculate final trust score
      const finalTrustScore = this.calculateFinalScore(
        cacResult.confidenceScore,
        nameMatchScore,
        squadCheck.performed,
        addressCheck.isValid,
      );

      // 7. Determine verdict
      const verdict = this.determineVerdict(
        finalTrustScore,
        cacResult,
        squadCheck,
      );

      // 8. Update vendor record with results
      await this.vendorRepository.updateVerificationResult(vendor.id, {
        extractedBusinessName: cacResult.extractedBusinessName,
        extractedRcNumber: cacResult.rcNumber,
        extractedRegistrationDate: cacResult.registrationDate,
        extractedAddress: cacResult.address,
        bankAccountName,
        nameMatchScore,
        trustScore: finalTrustScore,
        verdict: verdict.label,
        status: verdict.status,
        rejectionReason: verdict.reason,
        verificationChecks,
      });

      // 9. Debit wallet
      await this.walletService.debitWallet(
        organisationId,
        10,
        'Verification charge',
      );

      // 10. Return result
      return {
        vendorId: vendor.id,
        businessName: dto.businessName,
        verdict: verdict.label,
        trustScore: finalTrustScore,
        status: verdict.status,
        summary: verdict.reason,
        checks: verificationChecks,
        extractedFields: verificationChecks.extractedFields,
      };
    } catch (err) {
      await this.vendorRepository.updateVerificationResult(vendor.id, {
        status: VerificationStatus.REJECTED,
        verdict: 'REJECTED',
        rejectionReason: `Verification pipeline error: ${err.message}`,
      });
      throw err;
    }
  }

  // ─── Get all vendors for an org ───────────────────────────────
  async getOrgVendors(organisationId: string) {
    return this.vendorRepository.findByOrgId(organisationId);
  }

  // ─── Get bank list ────────────────────────────────────────────
  getBanks(search?: string) {
    const banks = search ? searchBanksByName(search) : NIGERIAN_BANKS;
    return { banks, total: banks.length };
  }

  // ─── Lookup bank account name ─────────────────────────────────
  async lookupBankAccount(bankCode: string, accountNumber: string) {
    const bank = getBankByCode(bankCode);
    if (!bank) throw new BadRequestException('Invalid bank code');

    try {
      const result = await this.squadAccountLookup(bankCode, accountNumber);
      return {
        accountName: result.account_name,
        accountNumber: result.account_number,
        bankName: bank.name,
        bankCode,
      };
    } catch {
      throw new BadRequestException(
        'Could not resolve account. Check the account number and bank code.',
      );
    }
  }

  // ─── Squad Account Lookup ─────────────────────────────────────
  private async squadAccountLookup(bankCode: string, accountNumber: string) {
    const response = await axios.post(
      `${this.configService.get('SQUAD_BASE_URL')}/payout/account/lookup`,
      { bank_code: bankCode, account_number: accountNumber },
      {
        headers: {
          Authorization: `Bearer ${this.configService.get('SQUAD_SECRET_KEY')}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data.data;
  }

  // ─── Trust Score Calculation ──────────────────────────────────
  private calculateFinalScore(
    confidenceScore: number,
    nameMatchScore: number,
    squadPerformed: boolean,
    addressValid: boolean,
  ): number {
    const addressBonus = addressValid ? 10 : 0;

    if (squadPerformed) {
      // 60% AI confidence, 30% name match, 10% address bonus
      return Math.min(
        100,
        Math.round(
          confidenceScore * 0.6 + nameMatchScore * 0.3 + addressBonus,
        ),
      );
    }

    // 90% AI confidence, 10% address bonus
    return Math.min(100, Math.round(confidenceScore * 0.9 + addressBonus));
  }

  // ─── Verdict Logic ────────────────────────────────────────────
  private determineVerdict(
    score: number,
    cacResult: Record<string, any>,
    squadCheck: { performed: boolean; passed: boolean; reason: string },
  ) {
    if (!cacResult.isCacDocument) {
      return {
        label: 'REJECTED',
        status: VerificationStatus.REJECTED,
        reason:
          cacResult.authenticityReason ||
          'Document does not appear to be a valid CAC certificate.',
      };
    }

    if (!cacResult.rcNumber) {
      return {
        label: 'REJECTED',
        status: VerificationStatus.REJECTED,
        reason: 'No RC number found in document.',
      };
    }

    if (squadCheck.performed && !squadCheck.passed) {
      return {
        label: 'REJECTED',
        status: VerificationStatus.REJECTED,
        reason: squadCheck.reason,
      };
    }

    if (score >= 70) {
      return {
        label: 'VERIFIED',
        status: VerificationStatus.VERIFIED,
        reason: `Vendor passed all verification checks with a trust score of ${score}/100.`,
      };
    }

    if (score >= 45) {
      return {
        label: 'REVIEW',
        status: VerificationStatus.REVIEW,
        reason: `Vendor requires manual review. Trust score: ${score}/100.`,
      };
    }

    return {
      label: 'REJECTED',
      status: VerificationStatus.REJECTED,
      reason: `Vendor failed verification. Trust score too low: ${score}/100.`,
    };
  }
}