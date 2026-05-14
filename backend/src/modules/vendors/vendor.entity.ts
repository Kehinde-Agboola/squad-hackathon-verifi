import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  REVIEW = 'review',
}

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Which org submitted this vendor
  @Column()
  organisationId!: string;

  // Vendor business details
  @Column()
  businessName!: string;

  @Column({ nullable: true })
  cacNumber!: string;

  @Column({ nullable: true })
  bankAccount!: string;

  @Column({ nullable: true })
  bankCode!: string;

  @Column({ nullable: true })
  contactEmail!: string;

  @Column({ nullable: true })
  contactPhone!: string;

  // CAC Document
  @Column({ nullable: true })
  cacDocumentUrl!: string; // Cloudinary URL

  // OCR Extracted Fields
  @Column({ nullable: true })
  extractedBusinessName!: string;

  @Column({ nullable: true })
  extractedRcNumber!: string;

  @Column({ nullable: true })
  extractedRegistrationDate!: string;

  @Column({ nullable: true })
  extractedAddress!: string;

  // Verification Results
  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  status!: VerificationStatus;

  @Column({ type: 'int', default: 0 })
  trustScore!: number;

  @Column({ nullable: true })
  verdict!: string; // VERIFIED | REJECTED | REVIEW

  @Column({ nullable: true })
  rejectionReason!: string;

  // Individual check results stored as JSON
  @Column({ type: 'jsonb', nullable: true })
  verificationChecks!: Record<string, any>;

  // Squad account lookup result
  @Column({ nullable: true })
  bankAccountName!: string; // what Squad returned

  @Column({ nullable: true })
  nameMatchScore!: number; // fuzzy match %

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
