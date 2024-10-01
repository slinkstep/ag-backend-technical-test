import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Public } from 'src/auth/decorators/auth.public.route.decorator';
import { CampaignService } from '../services/campaigns.service';
import { CreateCampaignInput } from 'graphql/inputs/campaign/create.campaign.input';
import { CampaignType } from 'graphql/types/campaign.type';

@Resolver(() => CampaignType)
export class CampaignResolver {
  constructor(private readonly campaignService: CampaignService) {}

  @Public()
  @Query(() => [CampaignType], { name: 'campaigns' })
  async getUsers(): Promise<CampaignType[]> {
    return this.campaignService.findAll();
  }

  @Public()
  @Mutation(() => CampaignType)
  async createCampaign(
    @Args('input') input: CreateCampaignInput,
    // @Context() context,
  ): Promise<CampaignType> {
    // const admin = context.req.user; // Assuming the authenticated admin is attached to the request
    // if (!admin || !admin.id) {
    //   throw new BadRequestException('Invalid admin credentials.');
    // }

    const campaign = await this.campaignService.createCampaign(input, 1);
    return campaign;
  }
}
