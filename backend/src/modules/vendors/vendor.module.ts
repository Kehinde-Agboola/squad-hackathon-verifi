import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './vendor.entity';
import { VendorRepository } from './vendor.repository';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { CacService } from './cac.service';
import { OrganisationModule } from '../organisations/organisation.module';
import { AiExtractionService } from './ai-extraction.service';
import { AddressVerificationService } from './address-verification.service';
import { WalletService } from '../wallets/wallet.service';
import { OrganisationRepository } from '../organisations/organisation.repository';
import { WalletModule } from '../wallets/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor]),
    WalletModule,
    OrganisationModule, // needed so ApiKeyGuard can access OrganisationService
  ],
  controllers: [VendorController],
  providers: [
    VendorService,
    AddressVerificationService,
    VendorRepository,
    AiExtractionService,
    CacService,
  ],
})
export class VendorModule {}
