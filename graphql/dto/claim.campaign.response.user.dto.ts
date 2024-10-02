import { ObjectType, Field } from '@nestjs/graphql';
import { CampaignType } from 'graphql/types/campaign.type';



@ObjectType()
export class ClaimCampaignResponse {
  @Field(() => CampaignType, { nullable: true })
  
  campaign?: CampaignType;

  @Field()
  claimed: boolean;
}
