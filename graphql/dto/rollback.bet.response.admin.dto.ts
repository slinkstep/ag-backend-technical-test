import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RollbackRequestResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
