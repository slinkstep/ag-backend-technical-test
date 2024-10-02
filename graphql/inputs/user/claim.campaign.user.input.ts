import { InputType, Field } from '@nestjs/graphql';
import {  IsEnum, IsString } from 'class-validator';
import { CampaignCategory } from 'graphql/types/enums/enums';

@InputType()
export class UserClaimCampaignInput {

  @Field({ nullable: true })
  @IsString()
  promoCode: string;

  @Field(() => CampaignCategory)
  @IsEnum(CampaignCategory)
  category: CampaignCategory;
}
