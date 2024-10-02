import { Injectable } from '@nestjs/common';

import { Transaction } from 'sequelize/models';
import { TransactionsRepository } from '../repositores/transactions.repository';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction =
      await this.transactionsRepository.createTransaction(createTransactionDto);
    return transaction;
  }

  async getTransactionById(id: number): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findById(id);

    return transaction;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionsRepository.findAll();
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return this.transactionsRepository.findByUserId(userId);
  }
}
