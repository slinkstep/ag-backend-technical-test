import { ObjectType, Field } from '@nestjs/graphql';
import { UserType } from 'graphql/types/user.type';



@ObjectType()
export class AuthResponse {
  @Field(() => UserType)
  user: UserType;

  @Field()
  token: string;
}
