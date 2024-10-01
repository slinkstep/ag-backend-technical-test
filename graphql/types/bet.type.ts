import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { UserType } from './user.type';
import { BetStatus } from './enums/enums';

@ObjectType()
export class BetType {
  @Field(() => Int)
  id: number;

  @Field(() => UserType)
  user: UserType;

  @Field(() => Float)
  amount: number;

  @Field(() => Float)
  chance: number;

  @Field(() => Float, { nullable: true })
  payout?: number;

  @Field({ name: 'roundId' })
  roundId: string;

  @Field(() => Float)
  margin: number;

  @Field({ name: 'isBonus' })
  isBonus: boolean;

  @Field({ nullable: true })
  win?: boolean;

  @Field(() => BetStatus)
  status: BetStatus;
}
