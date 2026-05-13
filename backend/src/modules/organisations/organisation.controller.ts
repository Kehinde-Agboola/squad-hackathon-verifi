import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { OrganisationService } from './organisation.service';
import {
  LoginOrganisationDto,
  UpdateOrganisationDto,
} from './dto/login-organisation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SignupOrganisationDto } from './dto/organisation.dto';

@ApiTags('Organisations')
@Controller('organisations')
export class OrganisationController {
  constructor(private readonly orgService: OrganisationService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Register a new organisation (e.g. Chowdeck, Glovo, HR firm)',
  })
  @ApiResponse({
    status: 201,
    description: 'Organisation registered successfully',
  })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async signup(@Body() dto: SignupOrganisationDto) {
    return this.orgService.signup(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Organisation login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginOrganisationDto) {
    return this.orgService.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get logged-in organisation profile' })
  async getProfile(@Req() req: any) {
    return this.orgService.getProfile(req.user.id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update organisation profile and webhook URL' })
  async updateProfile(@Req() req: any, @Body() dto: UpdateOrganisationDto) {
    return this.orgService.updateProfile(req.user.id, dto);
  }

  @Post('regenerate-api-key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Regenerate API key — invalidates old key immediately',
  })
  async regenerateApiKey(@Req() req: any) {
    return this.orgService.regenerateApiKey(req.user.id);
  }
}
