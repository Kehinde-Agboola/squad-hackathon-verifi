/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { OrganisationRepository } from './organisation.repository';
import {
  LoginOrganisationDto,
  UpdateOrganisationDto,
} from './dto/login-organisation.dto';
import { Organisation, OrgStatus } from './organisation.entity';
import { SignupOrganisationDto } from './dto/organisation.dto';
import { ref } from 'process';
import { WalletService } from '../wallets/wallet.service';

@Injectable()
export class OrganisationService {
  private readonly logger = new Logger(OrganisationService.name);

  constructor(
    private readonly orgRepository: OrganisationRepository,
    private readonly jwt: JwtService,
    private readonly walletService: WalletService,
  ) {}

  // ─── Signup ────────────────────────────────────────────────
  async signup(dto: SignupOrganisationDto) {
    const exists = await this.orgRepository.existsByEmail(dto.email);
    if (exists) {
      throw new ConflictException(
        'An organisation with this email already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const apiKey = this.generateApiKey();

    const org = await this.orgRepository.create({
      ...dto,
      password: hashedPassword,
      apiKey,
    });

    await this.walletService.createWallet(org);

    // const token = this.signToken(org);

    return {
      error: false,
      message: 'Organisation registered successfully',
      organisation: this.sanitise(org),
    };
  }

  // ─── Login ─────────────────────────────────────────────────
  async login(dto: LoginOrganisationDto) {
    const org = await this.orgRepository.findByEmail(dto.email);
    if (!org) {
      throw new UnauthorizedException('Invalid email. Account not found');
    }

    const passwordMatch = await bcrypt.compare(dto.password, org.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password. Try again.');
    }

    if (org.status === OrgStatus.SUSPENDED) {
      throw new UnauthorizedException(
        'Your organisation account has been suspended. Contact support.',
      );
    }

    const token = await this.signToken(org);
    return {
      message: 'Login successful',
      token,
      organisation: this.sanitise(org),
    };
  }

  // ─── Get Profile ────────────────────────────────────────────
  async getProfile(orgId: string) {
    const org = await this.orgRepository.findById(orgId);
    if (!org) throw new NotFoundException('Organisation not found');
    return this.sanitise(org);
  }

  // ─── Update Profile ─────────────────────────────────────────
  async updateProfile(orgId: string, dto: UpdateOrganisationDto) {
    const org = await this.orgRepository.findById(orgId);
    if (!org) throw new NotFoundException('Organisation not found');

    const updated = await this.orgRepository.update(orgId, dto);
    if (!updated) throw new NotFoundException('Organisation not found');

    return {
      message: 'Profile updated successfully',
      organisation: this.sanitise(updated),
    };
  }

  // ─── Regenerate API Key ──────────────────────────────────────
  async regenerateApiKey(orgId: string) {
    const org = await this.orgRepository.findById(orgId);
    if (!org) throw new NotFoundException('Organisation not found');

    const newApiKey = this.generateApiKey();
    await this.orgRepository.update(orgId, { apiKey: newApiKey });

    this.logger.log(`API key regenerated for org: ${orgId}`);

    return {
      message:
        'API key regenerated successfully. Update your integrations immediately.',
      apiKey: newApiKey,
    };
  }

  // ─── Validate API Key (used by API key guard) ────────────────
  async validateApiKey(apiKey: string): Promise<Organisation | null> {
    return this.orgRepository.findByApiKey(apiKey);
  }

  // ─── Helpers ────────────────────────────────────────────────
  private async signToken(org: Organisation) {
    const payload = {
      _id: org.id,
      name: org.name,
      email: org.email,
    };

    const accessToken = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d',
      }),
    ]);
    console.log('Generated JWT token for org:', accessToken[0]);
    return accessToken[0];
  }

  private generateApiKey(): string {
    // Format: vs_live_<32 random hex chars>
    return `vs_live_${crypto.randomBytes(16).toString('hex')}`;
  }

  // Strip password and sensitive fields before returning
  private sanitise(org: Organisation) {
    const { password, ...rest } = org;
    return rest;
  }
}
