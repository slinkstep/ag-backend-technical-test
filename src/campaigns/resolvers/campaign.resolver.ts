import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CampaignService } from '../services/campaigns.service';
import { CreateCampaignInput } from 'graphql/inputs/campaign/create.campaign.input';
import { CampaignType } from 'graphql/types/campaign.type';
import { BadRequestException } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Resolver(() => CampaignType)
export class CampaignResolver {
  constructor(private readonly campaignService: CampaignService) {}

  @Roles(Role.Admin)
  @Query(() => [CampaignType], { name: 'campaigns' })
  async getCampaigns(): Promise<CampaignType[]> {
    return this.campaignService.findAll();
  }

  @Roles(Role.Admin)
  @Mutation(() => CampaignType)
  async createCampaign(
    @Args('input') input: CreateCampaignInput,
    @Context() context,
  ): Promise<CampaignType> {
    const admin = context.req.user; // Assuming the authenticated admin is attached to the request
    if (!admin || !admin.id) {
      throw new BadRequestException('Invalid admin credentials.');
    }

    const campaign = await this.campaignService.createCampaign(input, admin.id);
    return campaign;
  }
}
