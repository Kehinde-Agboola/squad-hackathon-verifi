/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

import { Wallet } from './entities/wallet.entity';
import { WalletTransaction } from './entities/transaction.entity';
import { Organisation } from '../organisations/organisation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, WalletTransaction, Organisation]),
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
