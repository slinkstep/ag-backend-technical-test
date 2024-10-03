import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Transaction } from 'sequelize/models';
import { GlobalLogger } from 'src/logger/global.logger.service';
import { TransactionsService } from './services/transactions.service';
import { TransactionsRepository } from './repositores/transactions.repository';

@Module({
  imports: [SequelizeModule.forFeature([Transaction])],
  providers: [TransactionsService, TransactionsRepository, GlobalLogger],
  exports: [TransactionsService, TransactionsRepository],
})
export class TransactionsModule {}
