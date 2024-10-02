import {
  ObjectType,
  Field,
  Int,
  Float,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import { UserStatus } from './enums/enums';
import { BetType } from './bet.type';
import { TransactionType } from './transaction.type';

@ObjectType()
export class UserType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => String, { name: 'email' })
  authProviderEmail: string;

  @Field(() => Float, { name: 'realBalance' })
  realBalance: number;

  @Field(() => Float, { name: 'bonusBalance' })
  bonusBalance: number;

  @Field(() => UserStatus)
  status: UserStatus;

  @Field(() => [BetType], { nullable: true })
  bets?: BetType[];

  @Field(() => [TransactionType], { nullable: true })
  transactions?: TransactionType[];

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt?: Date;
}
