import { ObjectType, Field } from '@nestjs/graphql';
import { AdminType } from '../types/admin.type';

@ObjectType()
export class AuthResponseAdmin {
  @Field(() => AdminType)
  admin: AdminType;

  @Field()
  token: string;
}
