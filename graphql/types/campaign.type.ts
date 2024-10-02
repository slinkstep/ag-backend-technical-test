import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

import { CampaignCategory, CampaignStatus } from './enums/enums';
import { TransactionType } from './transaction.type';

@ObjectType()
export class CampaignType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ name: 'promoCode' })
  promoCode: string;

  @Field(() => CampaignCategory)
  category: CampaignCategory;

  @Field(() => Float, { name: 'playableBalanceAmount' })
  playableBalanceAmount: number;

  @Field(() => Float, { name: 'bonusBalanceAmount' })
  bonusBalanceAmount: number;

  @Field(() => Date, { name: 'startDate' })
  startDate: Date;

  @Field(() => Date, { name: 'endDate' })
  endDate: Date;

  @Field(() => CampaignStatus)
  status: CampaignStatus;

  @Field(() => [TransactionType], { nullable: true })
  transactions?: TransactionType[];
}
