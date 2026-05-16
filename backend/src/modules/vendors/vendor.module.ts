import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Vendor } from './vendor.entity';
import { VendorRepository } from './vendor.repository';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { CacService } from './cac.service';
import { AiExtractionService } from './ai-extraction.service';
import { AddressVerificationService } from './address-verification.service';
import { OrganisationModule } from '../organisations/organisation.module';
import { WalletModule } from '../wallets/wallet.module';
import { JwtOrApiKeyGuard } from 'src/common/guards/jwt-or-apikey.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor]),
    OrganisationModule,
    WalletModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [VendorController],
  providers: [
    VendorService,
    VendorRepository,
    CacService,
    AiExtractionService,
    AddressVerificationService,
    JwtOrApiKeyGuard,
  ],
})
export class VendorModule {}