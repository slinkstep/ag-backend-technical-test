import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ResetUserPasswordResponse {
  @Field()
  resetLink: string;


}