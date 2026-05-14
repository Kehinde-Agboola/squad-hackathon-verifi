import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './vendor.entity';
import { VendorRepository } from './vendor.repository';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { CacService } from './cac.service';
import { OrganisationModule } from '../organisations/organisation.module';
import { AiExtractionService } from './ai-extraction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor]),
    OrganisationModule, // needed so ApiKeyGuard can access OrganisationService
  ],
  controllers: [VendorController],
  providers: [VendorService, VendorRepository, AiExtractionService, CacService],
})
export class VendorModule {}
