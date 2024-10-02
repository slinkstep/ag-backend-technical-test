import { InputType, Field, Float } from '@nestjs/graphql';

import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { CampaignCategory, CampaignStatus } from 'graphql/types/enums/enums';


@InputType()
export class CreateCampaignInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  promoCode: string;

  @Field(() => CampaignCategory)
  @IsEnum(CampaignCategory)
  category: CampaignCategory;

  @Field(() => Float)
  @IsNumber()
  @IsPositive()
  playableBalanceAmount: number;

  @Field(() => Float)
  @IsNumber()
  @IsPositive()
  bonusBalanceAmount: number;

  @Field()
  @IsDateString()
  startDate: string;

  @Field()
  @IsDateString()
  endDate: string;

  @Field(() => CampaignStatus)
  @IsEnum(CampaignStatus)
  status: CampaignStatus;
}
