import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { UserType } from './user.type';

import { CampaignType } from './campaign.type';
import {
  TransactionCategory,
  TransactionStatus,
  BalanceType,
} from './enums/enums';
import { BetType } from './bet.type';

@ObjectType()
export class TransactionType {
  @Field(() => Int)
  id: number;

  @Field(() => UserType)
  user: UserType;

  @Field(() => Float)
  amount: number;

  @Field(() => TransactionCategory)
  category: TransactionCategory;

  @Field(() => TransactionStatus)
  status: TransactionStatus;

  @Field(() => BalanceType)
  balance: BalanceType;

  @Field(() => BetType, { nullable: true })
  bet?: BetType;

  @Field(() => CampaignType, { nullable: true })
  campaign?: CampaignType;
}
