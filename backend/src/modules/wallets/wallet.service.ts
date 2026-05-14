/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import axios from 'axios';

import { Wallet } from './entities/wallet.entity';
import {
  TransactionType,
  WalletTransaction,
} from './entities/transaction.entity';
import { Organisation } from '../organisations/organisation.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,

    @InjectRepository(WalletTransaction)
    private txRepo: Repository<WalletTransaction>,

    @InjectRepository(Organisation)
    private orgRepo: Repository<Organisation>,
  ) {}

  async createWallet(organisation: Organisation) {
    const wallet = this.walletRepo.create({
      organisation,
      balance: 0,
    });

    return this.walletRepo.save(wallet);
  }

  async getWallet(orgId: string) {
    const wallet = await this.walletRepo.findOne({
      where: {
        organisation: {
          id: orgId,
        },
      },
      relations: ['organisation'],
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async initializeTopUp(orgId: string, amount: number) {
    const org = await this.orgRepo.findOne({
      where: { id: orgId },
    });

    if (!org) {
      throw new NotFoundException('Organisation not found');
    }

    const reference = `TOPUP-${Date.now()}-${org.id}`;

    const payload = {
      amount: amount * 100,
      email: org.email,
      currency: 'NGN',
      initiate_type: 'inline',
      transaction_ref: reference,
      callback_url: 'https://yourfrontend.com/success',
    };

    const response = await axios.post(
      `${process.env.SQUAD_BASE_URL}/transaction/initiate`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.SQUAD_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  }

  async handleWebhook(payload: any) {
    const event = payload;

    if (event.event !== 'charge_success') {
      return;
    }

    const data = event.data;

    const reference = data.transaction_ref;

    const splitRef = reference.split('-');

    const orgId = splitRef[splitRef.length - 1];

    const wallet = await this.getWallet(orgId);

    const existingTx = await this.txRepo.findOne({
      where: {
        reference,
      },
    });

    if (existingTx) {
      return;
    }

    const amount = Number(data.amount) / 100;

    wallet.balance = Number(wallet.balance) + Number(amount);

    await this.walletRepo.save(wallet);

    const tx = this.txRepo.create({
      wallet,
      type: TransactionType.CREDIT,
      amount,
      reference,
      description: 'Wallet top up',
    });

    await this.txRepo.save(tx);

    return {
      message: 'Wallet funded successfully',
    };
  }

  async debitWallet(orgId: string, amount: number, description: string) {
    const wallet = await this.getWallet(orgId);

    if (Number(wallet.balance) < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    wallet.balance = Number(wallet.balance) - Number(amount);

    await this.walletRepo.save(wallet);

    const tx = this.txRepo.create({
      wallet,
      type: TransactionType.DEBIT,
      amount,
      reference: `DEBIT-${Date.now()}`,
      description,
    });

    await this.txRepo.save(tx);

    return wallet;
  }

  async getTransactions(orgId: string) {
    const wallet = await this.getWallet(orgId);

    return this.txRepo.find({
      where: {
        wallet: {
          id: wallet.id,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
