/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { WalletService } from './wallet.service';
import { TopUpDto } from './dto/topup.dto';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get(':orgId')
  @ApiOperation({
    summary: 'Get organisation wallet',
  })
  @ApiParam({
    name: 'orgId',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiResponse({
    status: 200,
    description: 'Wallet fetched successfully',
  })
  async getWallet(@Param('orgId') orgId: string) {
    return this.walletService.getWallet(orgId);
  }

  @Get(':orgId/transactions')
  @ApiOperation({
    summary: 'Get wallet transaction history',
  })
  @ApiParam({
    name: 'orgId',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiResponse({
    status: 200,
    description: 'Transactions fetched successfully',
  })
  async getTransactions(@Param('orgId') orgId: string) {
    return this.walletService.getTransactions(orgId);
  }

  @Post(':orgId/topup')
  @ApiOperation({
    summary: 'Initialize Squad wallet top up',
  })
  @ApiParam({
    name: 'orgId',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBody({
    type: TopUpDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Top up initialized successfully',
  })
  async initializeTopUp(@Param('orgId') orgId: string, @Body() dto: TopUpDto) {
    return this.walletService.initializeTopUp(orgId, dto.amount);
  }

  @Post('webhook')
  @ApiOperation({
    summary: 'Squad payment webhook',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook received successfully',
  })
  async webhook(@Req() req: any) {
    return this.walletService.handleWebhook(req.body);
  }
}
