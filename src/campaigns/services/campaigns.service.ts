import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateCampaignInput } from 'graphql/inputs/campaign/create.campaign.input';
import { Campaign } from 'sequelize/models';
import { CampaignCategory } from 'sequelize/models/enums/enums';
import { CampaignRepository } from '../repositories/campaign.repository';
import { TransactionsRepository } from 'src/transactions/repositores/transactions.repository';

@Injectable()
export class CampaignService {
  constructor(
    private campaignRepository: CampaignRepository,

    private transactionsRepository: TransactionsRepository,
  ) {}

  async findAll(): Promise<Campaign[]> {
    return this.campaignRepository.findAll();
  }

  async createCampaign(
    input: CreateCampaignInput,
    createdBy: number,
  ): Promise<Campaign> {
    const campaign = await this.campaignRepository.create(input, createdBy);

    return campaign;
  }

  async validatePromoCode(
    promoCode: string,
    userId?: number,
    category?: CampaignCategory,
  ): Promise<Campaign> {
    const campaign = await this.campaignRepository.findByPromoCode(promoCode);

    if (!campaign) {
      throw new NotFoundException(
        `Campaign with promo code ${promoCode} is not found or is not active`,
      );
    }

    // If a category is provided, validate that it matches the campaign's category
    if (category && campaign.category !== category) {
      throw new BadRequestException(
        `Campaign with promo code ${promoCode} does not match the required category`,
      );
    }

    if (userId) {
      const userCampaignTransaction =
        await this.transactionsRepository.findByUserIdAndCampaignId(
          userId,
          campaign.id,
        );

      if (userCampaignTransaction) {
        throw new UnauthorizedException(
          `Campaign with promo code ${promoCode} was already claimed for user`,
        );
      }
    }

    return campaign;
  }
}
