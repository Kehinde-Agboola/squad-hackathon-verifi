import {
  Controller,
  Post,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
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
} from '@nestjs/swagger';
import { VendorService } from './vendor.service';
import { VerifyVendorDto } from './dto/verify-vendor.dto';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';

@ApiTags('Vendor Verification')
@ApiSecurity('x-api-key')
@UseGuards(ApiKeyGuard)
@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post('verify')
  @UseInterceptors(FileInterceptor('cacDocument', { storage: undefined })) // memory storage — buffer only
  @ApiOperation({ summary: 'Submit a vendor for CAC verification (org API key required)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        businessName: { type: 'string', example: 'Mama Cass Restaurant Ltd' },
        bankAccount: { type: 'string', example: '0123456789' },
        bankCode: { type: 'string', example: '000013' },
        contactEmail: { type: 'string', example: 'vendor@email.com' },
        contactPhone: { type: 'string', example: '+2348012345678' },
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
    return this.vendorService.verifyVendor(
      req.organisation.id,
      dto,
      file,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all vendors submitted by this organisation' })
  async getOrgVendors(@Req() req: any) {
    return this.vendorService.getOrgVendors(req.organisation.id);
  }
}