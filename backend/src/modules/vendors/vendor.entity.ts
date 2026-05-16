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

  // ── Organisation ───────────────────────────────────────────
  @Column()
  organisationId!: string;

  // ── Business Info ──────────────────────────────────────────
  @Column()
  businessName!: string;

  @Column({ nullable: true })
  businessType!: string;

  @Column({ nullable: true })
  businessDescription!: string;

  @Column({ nullable: true })
  cacNumber!: string;

  // ── Vendor Address ─────────────────────────────────────────
  @Column({ nullable: true })
  street!: string;

  @Column({ nullable: true })
  city!: string;

  @Column({ nullable: true })
  state!: string;

  // ── Bank Details ───────────────────────────────────────────
  @Column({ nullable: true })
  bankAccount!: string;

  @Column({ nullable: true })
  bankCode!: string;

  @Column({ nullable: true })
  bankName!: string; // resolved from bankCode via constant

  // ── Contact ────────────────────────────────────────────────
  @Column({ nullable: true })
  contactEmail!: string;

  @Column({ nullable: true })
  contactPhone!: string;

  @Column({ nullable: true })
  contactPersonName!: string;

  // ── CAC Document ───────────────────────────────────────────
  @Column({ nullable: true })
  cacDocumentUrl!: string;

  // ── OCR / AI Extracted Fields ──────────────────────────────
  @Column({ nullable: true })
  extractedBusinessName!: string;

  @Column({ nullable: true })
  extractedRcNumber!: string;

  @Column({ nullable: true })
  extractedRegistrationDate!: string;

  @Column({ nullable: true })
  extractedAddress!: string;

  // ── Verification Results ───────────────────────────────────
  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  status!: VerificationStatus;

  @Column({ type: 'int', default: 0 })
  trustScore!: number;

  @Column({ nullable: true })
  verdict!: string;

  @Column({ nullable: true })
  rejectionReason!: string;

  @Column({ type: 'jsonb', nullable: true })
  verificationChecks!: Record<string, any>;

  // ── Squad Account Lookup Result ────────────────────────────
  @Column({ nullable: true })
  bankAccountName!: string;

  @Column({ nullable: true })
  nameMatchScore!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}