import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BetResolver } from './resolvers/bet.resolver';
import { BetService } from './services/bet.service';
import { Bet, Transaction, User } from 'sequelize/models';
import { BetRepository } from './repositories/bet.repository';

@Module({
  imports: [SequelizeModule.forFeature([Bet, User, Transaction])],
  providers: [BetResolver, BetService, BetRepository],
  exports: [BetService, BetRepository],
})
export class BetModule {}
