import {
  Controller,
  Post,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  Query,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiSecurity,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { VendorService } from './vendor.service';
import { VerifyVendorDto } from './dto/verify-vendor.dto';
import { JwtOrApiKeyGuard } from 'src/common/guards/jwt-or-apikey.guard';

@ApiTags('Vendor Verification')
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@UseGuards(JwtOrApiKeyGuard)
@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  // ── GET /vendors/banks — list all banks ──────────────────────
  @Get('banks')
  @ApiOperation({ summary: 'Get all supported Nigerian banks and their codes' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search banks by name e.g. "kuda", "access"',
  })
  getBanks(@Query('search') search?: string) {
    return this.vendorService.getBanks(search);
  }

  // ── POST /vendors/lookup-account — resolve account name ──────
  @Post('lookup-account')
  @ApiOperation({
    summary: 'Resolve bank account name before submitting verification',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        bankCode: { type: 'string', example: '000013' },
        accountNumber: { type: 'string', example: '0123456789' },
      },
      required: ['bankCode', 'accountNumber'],
    },
  })
  async lookupAccount(
    @Body() body: { bankCode: string; accountNumber: string },
  ) {
    return this.vendorService.lookupBankAccount(
      body.bankCode,
      body.accountNumber,
    );
  }

  // ── POST /vendors/verify — main verification endpoint ────────
  @Post('verify')
  @UseInterceptors(FileInterceptor('cacDocument', { storage: undefined }))
  @ApiOperation({
    summary: 'Submit a vendor for CAC verification',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        businessName: { type: 'string', example: 'Mama Cass Restaurant Ltd' },
        businessType: { type: 'string', example: 'Food & Beverage' },
        businessDescription: { type: 'string', example: 'A restaurant chain' },
        street: { type: 'string', example: '14 Allen Avenue' },
        city: { type: 'string', example: 'Ikeja' },
        state: { type: 'string', example: 'Lagos' },
        bankAccount: { type: 'string', example: '0123456789' },
        bankCode: { type: 'string', example: '000013' },
        contactEmail: { type: 'string', example: 'vendor@email.com' },
        contactPhone: { type: 'string', example: '+2348012345678' },
        contactPersonName: { type: 'string', example: 'John Doe' },
        cacDocument: { type: 'string', format: 'binary' },
      },
      required: ['businessName', 'cacDocument'],
    },
  })
  async verifyVendor(
    @Req() req: any,
    @Body() dto: VerifyVendorDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.vendorService.verifyVendor(req.organisation.id, dto, file);
  }

  // ── GET /vendors — list org's submitted vendors ───────────────
  @Get()
  @ApiOperation({ summary: 'Get all vendors submitted by this organisation' })
  async getOrgVendors(@Req() req: any) {
    return this.vendorService.getOrgVendors(req.organisation.id);
  }
}