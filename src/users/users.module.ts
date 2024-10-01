import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersResolver } from './resolvers/users.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'sequelize/models';
import { UsersRepository } from './repositories/users.repository';
import { AuthModule } from 'src/auth/auth.module';
import { CampaignModule } from 'src/campaign/campaign.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    AuthModule,
    CampaignModule,
    TransactionsModule,
  ],
  providers: [UsersService, UsersRepository, UsersResolver],
})
export class UsersModule {}
