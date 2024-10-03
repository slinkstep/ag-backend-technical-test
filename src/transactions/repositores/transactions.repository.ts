import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize/models';
import { Transaction as DBtransaction } from 'sequelize';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import {
  TransactionCategory,
  TransactionStatus,
} from 'sequelize/models/enums/enums';

@Injectable()
export class TransactionsRepository {
  constructor(
    @InjectModel(Transaction)
    private readonly transactionModel: typeof Transaction,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    transaction?: DBtransaction,
  ): Promise<Transaction> {
    return await this.transactionModel.create(createTransactionDto, {
      transaction,
    });
  }

  async findById(id: number): Promise<Transaction | null> {
    return await this.transactionModel.findByPk(id);
  }

  async findAll(): Promise<Transaction[]> {
    return await this.transactionModel.findAll();
  }

  async findByUserId(userId: number): Promise<Transaction[]> {
    return await this.transactionModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  async findByUserIdAndCampaignId(
    userId: number,
    campaignId: number,
  ): Promise<Transaction> {
    return await this.transactionModel.findOne({
      where: { userId, campaignId, category: TransactionCategory.CAMPAIGN },
      order: [['createdAt', 'DESC']],
    });
  }

  async updateTransaction(
    id: number,
    updateData: Partial<Transaction>,
  ): Promise<[number, Transaction[]]> {
    return await this.transactionModel.update(updateData, {
      where: { id },
      returning: true,
    });
  }

  async deleteTransaction(id: number): Promise<number> {
    return await this.transactionModel.destroy({
      where: { id },
    });
  }

  async cancelTransactionsByBetId(
    betId: number,
    transaction?: DBtransaction,
  ): Promise<number[]> {
    return await this.transactionModel.update(
      { status: TransactionStatus.CANCELED },
      { where: { betId }, transaction },
    );
  }
}
