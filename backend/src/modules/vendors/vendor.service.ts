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

  async verifyVendor(
    organisationId: string,
    dto: VerifyVendorDto,
    file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('CAC document is required');

    // 1. Create initial vendor record
    const vendor = await this.vendorRepository.create({
      organisationId,
      businessName: dto.businessName,
      bankAccount: dto.bankAccount,
      bankCode: dto.bankCode,
      contactEmail: dto.contactEmail,
      contactPhone: dto.contactPhone,
      status: VerificationStatus.PENDING,
    });

    try {
      // 2. Run CAC document extraction + validation
      const cacResult = await this.cacService.extractAndValidateCac(
        file.buffer,
        file.mimetype,
        dto.businessName,
      );

      // After aiResult is returned with extracted address
      let addressCheck = {
        performed: false,
        isValid: false,
        confidence: 'low',
        formattedAddress: null,
        state: null,
        reason: 'No address extracted from document',
      };

      if (cacResult.extractedFields.address) {
        const addressResult =
          await this.addressVerificationService.verifyAddress(
            cacResult.extractedFields.address,
          );

        addressCheck = {
          performed: true,
          isValid: addressResult.isValid,
          confidence: addressResult.confidence,
          formattedAddress: addressResult.formattedAddress,
          state: addressResult.state,
          reason: addressResult.reason,
        };
      }

      // 3. Squad account lookup (if bank details provided)
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

          // Fuzzy match: submitted business name vs bank account name
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

      // 4. Build full verification checks summary
      const verificationChecks = {
        cacDocument: {
          ...cacResult.documentChecks,
          documentScore: cacResult.documentScore,
        },
        extractedFields: {
          businessName: cacResult.extractedFields.businessName,
          rcNumber: cacResult.extractedFields.rcNumber,
          registrationDate: cacResult.extractedFields.registrationDate,
          address: cacResult.extractedFields.address,
        },
        squadAccountLookup: squadCheck,
        addressVerification: addressCheck,
      };

      // 5. Calculate final trust score
      const finalTrustScore = this.calculateFinalScore(
        cacResult.documentScore,
        nameMatchScore,
        squadCheck.performed,
        cacResult.aiConfidence, // ← add this
        addressCheck.isValid,
      );

      // 6. Determine verdict
      const verdict = this.determineVerdict(
        finalTrustScore,
        cacResult.documentChecks,
        squadCheck,
      );

      // 7. Update vendor record
      await this.vendorRepository.updateVerificationResult(vendor.id, {
        extractedBusinessName: cacResult.extractedFields.businessName,
        extractedRcNumber: cacResult.extractedFields.rcNumber,
        extractedRegistrationDate: cacResult.extractedFields.registrationDate,
        extractedAddress: cacResult.extractedFields.address,
        bankAccountName,
        nameMatchScore,
        trustScore: finalTrustScore,
        verdict: verdict.label,
        status: verdict.status,
        rejectionReason: verdict.reason,
        verificationChecks,
      });

      await this.walletService.debitWallet(
        organisationId,
        10,
        'Verification charge',
      );
      // 8. Return result
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
      // Update vendor as failed
      await this.vendorRepository.updateVerificationResult(vendor.id, {
        status: VerificationStatus.REJECTED,
        verdict: 'REJECTED',
        rejectionReason: `Verification pipeline error: ${err.message}`,
      });
      throw err;
    }
  }

  // ─── Get all vendors submitted by an org ──────────────────────
  async getOrgVendors(organisationId: string) {
    return this.vendorRepository.findByOrgId(organisationId);
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

  // ─── Final score combining CAC doc score + Squad match ────────
  private calculateFinalScore(
    documentScore: number,
    nameMatchScore: number,
    squadPerformed: boolean,
    aiConfidence: number,
    addressValid: boolean,
  ): number {
    const addressBonus = addressValid ? 10 : 0;

    if (squadPerformed) {
      // 35% doc, 25% AI, 30% name match, 10% address
      return Math.min(
        100,
        Math.round(
          documentScore * 0.35 +
            aiConfidence * 0.25 +
            nameMatchScore * 0.3 +
            addressBonus,
        ),
      );
    }

    // 50% doc, 40% AI, 10% address
    return Math.min(
      100,
      Math.round(documentScore * 0.5 + aiConfidence * 0.4 + addressBonus),
    );
  }

  // ─── Determine verdict from score + checks ────────────────────
  private determineVerdict(
    score: number,
    docChecks: Record<string, boolean>,
    squadCheck: { performed: boolean; passed: boolean; reason: string },
  ) {
    // Hard reject: no CAC header — not a CAC document at all
    if (!docChecks.hasCacHeader) {
      return {
        label: 'REJECTED',
        status: VerificationStatus.REJECTED,
        reason:
          'Document does not appear to be a CAC certificate. Corporate Affairs Commission header not found.',
      };
    }

    // Hard reject: no RC number
    if (!docChecks.hasRcNumber) {
      return {
        label: 'REJECTED',
        status: VerificationStatus.REJECTED,
        reason: 'No RC number found in document.',
      };
    }

    // Hard reject: Squad check failed with low name match
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
        reason: `Vendor requires manual review. Trust score: ${score}/100. Some checks did not pass.`,
      };
    }

    return {
      label: 'REJECTED',
      status: VerificationStatus.REJECTED,
      reason: `Vendor failed verification. Trust score too low: ${score}/100.`,
    };
  }
}
