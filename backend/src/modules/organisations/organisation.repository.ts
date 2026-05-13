import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organisation, OrgStatus } from './organisation.entity';

@Injectable()
export class OrganisationRepository {
  constructor(
    @InjectRepository(Organisation)
    private readonly repo: Repository<Organisation>,
  ) {}

  async create(data: Partial<Organisation>): Promise<Organisation> {
    const org = this.repo.create(data);
    return this.repo.save(org);
  }

  async findById(id: string): Promise<Organisation | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Organisation | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findByApiKey(apiKey: string): Promise<Organisation | null> {
    return this.repo.findOne({ where: { apiKey } });
  }

  async update(id: string, data: Partial<Organisation>) {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async incrementVerificationCount(id: string): Promise<void> {
    await this.repo.increment({ id }, 'totalVerificationsRequested', 1);
  }

  async suspend(id: string): Promise<void> {
    await this.repo.update(id, { status: OrgStatus.SUSPENDED });
  }

  async findAll(): Promise<Organisation[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repo.count({ where: { email } });
    return count > 0;
  }
}
