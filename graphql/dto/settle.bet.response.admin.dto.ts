import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SettlementRequestResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
