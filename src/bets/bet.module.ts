import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BetResolver } from './resolvers/bet.resolver';
import { BetService } from './services/bet.service';
import { Bet } from 'sequelize/models';
import { BetRepository } from './repositories/bet.repository';
import { UsersModule } from 'src/users/users.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { FirestoreBetsListenerService } from './services/bet.firestore.listener.service';

@Module({
  imports: [SequelizeModule.forFeature([Bet]), UsersModule, TransactionsModule],
  providers: [
    BetResolver,
    BetService,
    BetRepository,
    FirestoreBetsListenerService,
  ],
  exports: [BetService, BetRepository],
})
export class BetModule {}
