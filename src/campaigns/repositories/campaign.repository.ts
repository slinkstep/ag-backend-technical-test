import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Campaign } from 'sequelize/models';
import { CreateCampaignInput } from 'graphql/inputs/campaign/create.campaign.input';

import { CampaignCategory, CampaignStatus } from 'sequelize/models/enums/enums';
import { Op, ValidationError } from 'sequelize';

@Injectable()
export class CampaignRepository {
  constructor(
    @InjectModel(Campaign)
    private readonly campaignModel: typeof Campaign,
  ) {}

  async findAll(): Promise<Campaign[]> {
    return await this.campaignModel.findAll({
      include: ['admin'],
    });
  }

  async create(
    input: CreateCampaignInput,
    createdBy: number,
  ): Promise<Campaign> {
    try {
      const { startDate, endDate, ...otherFields } = input;

      const campaign = await this.campaignModel.create({
        ...otherFields,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdBy,
      });

      return campaign;
    } catch (error) {
      // Handle Sequelize validation errors
      if (error instanceof ValidationError) {
        throw new BadRequestException(
          `Validation failed: ${error.errors.map((err) => err.message).join(', ')}`,
        );
      }
    }
  }

  async findByPromoCode(
    promoCode: string,
    category?: CampaignCategory,
    status: CampaignStatus = CampaignStatus.ACTIVE,
  ): Promise<Campaign | null> {
    const whereClause: any = {
      promoCode,
      status,
      startDate: {
        [Op.lte]: new Date(),
      },
      endDate: {
        [Op.gte]: new Date(),
      },
    };

    if (category) {
      whereClause.category = category;
    }

    return await this.campaignModel.findOne({
      where: whereClause,
    });
  }
}
