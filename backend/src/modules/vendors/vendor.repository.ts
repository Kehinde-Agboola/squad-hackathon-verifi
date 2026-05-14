import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './vendor.entity';

@Injectable()
export class VendorRepository {
  constructor(
    @InjectRepository(Vendor)
    private readonly repo: Repository<Vendor>,
  ) {}

  async create(data: Partial<Vendor>): Promise<Vendor> {
    const vendor = this.repo.create(data);
    return this.repo.save(vendor);
  }

  async findById(id: string): Promise<Vendor | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByOrgId(organisationId: string): Promise<Vendor[]> {
    return this.repo.find({
      where: { organisationId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateVerificationResult(
    id: string,
    data: Partial<Vendor>,
  ): Promise<void> {
    await this.repo.update(id, data);
  }
}
