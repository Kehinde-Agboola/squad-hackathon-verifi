import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrgPlan {
  FREE = 'free',
  STARTER = 'starter',
  ENTERPRISE = 'enterprise',
}

export enum OrgStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

@Entity('organisations')
export class Organisation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Business/company name e.g. "Chowdeck Nigeria Ltd"

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // hashed

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  industry: string; // food delivery, HR, fintech etc.

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true })
  apiKey: string; // auto-generated on signup

  @Column({ nullable: true })
  webhookUrl: string; // where we push verification results

  @Column({
    type: 'enum',
    enum: OrgPlan,
    default: OrgPlan.FREE,
  })
  plan: OrgPlan;

  @Column({
    type: 'enum',
    enum: OrgStatus,
    default: OrgStatus.ACTIVE,
  })
  status: OrgStatus;

  @Column({ default: 0 })
  totalVerificationsRequested: number; // usage tracking

  @Column({ nullable: true })
  contactPersonName: string;

  @Column({ nullable: true })
  contactPersonRole: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
