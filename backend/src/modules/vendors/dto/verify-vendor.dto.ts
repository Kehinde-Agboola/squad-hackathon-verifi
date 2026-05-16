/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VALID_BANK_CODES } from 'src/common/constants/banks.constants';

export class VerifyVendorDto {
  @ApiProperty({ example: 'Mama Cass Restaurant Ltd' })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiPropertyOptional({ example: 'Food & Beverage' })
  @IsOptional()
  @IsString()
  businessType?: string;

  @ApiPropertyOptional({
    example: 'A restaurant chain serving Nigerian cuisine',
  })
  @IsOptional()
  @IsString()
  businessDescription?: string;

  // ── Vendor Address ─────────────────────────────────────────
  @ApiPropertyOptional({ example: '14 Allen Avenue' })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional({ example: 'Ikeja' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Lagos' })
  @IsOptional()
  @IsString()
  state?: string;

  // @ApiPropertyOptional({ example: '0123456789' })
  @ApiProperty()
  // @IsOptional()
  @IsString()
  bankAccount?: string;

  // // @ApiPropertyOptional({
  //   example: '000013',
  //   description: 'Bank code — get full list from GET /vendors/banks',
  // })
  @ApiProperty()
  // @IsOptional()
  @IsString()
  @IsIn(VALID_BANK_CODES, {
    message: 'Invalid bank code. Use GET /vendors/banks to get valid codes',
  })
  bankCode?: string;

  @ApiPropertyOptional({ example: 'vendor@email.com' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({ example: '+2348012345678' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  contactPersonName?: string;
}
