import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class RollbackRequestInput {
  @IsString()
  @IsNotEmpty({ message: 'roundId is required' })
  @Field()
  roundId: string;
}