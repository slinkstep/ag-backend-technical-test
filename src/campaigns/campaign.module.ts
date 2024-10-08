import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { CampaignService } from './services/campaigns.service';
import { CampaignResolver } from './resolvers/campaign.resolver';
import { Campaign } from 'sequelize/models';
import { CampaignRepository } from './repositories/campaign.repository';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [SequelizeModule.forFeature([Campaign]), TransactionsModule],
  providers: [CampaignResolver, CampaignService, CampaignRepository],
  exports: [CampaignService, CampaignRepository],
})
export class CampaignModule {}
