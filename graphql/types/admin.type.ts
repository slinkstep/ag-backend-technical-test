import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserStatus } from './enums/enums';

@ObjectType()
export class AdminType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => String, { name: 'email' })
  authProviderEmail: string;

  @Field(() => UserStatus)
  status: UserStatus;
}
