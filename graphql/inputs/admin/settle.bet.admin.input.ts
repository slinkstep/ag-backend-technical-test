import { InputType, Field, Float } from '@nestjs/graphql';
import { Min, Max, IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class SettlementRequestInput {
  
  @IsString()
  @IsNotEmpty({ message: 'roundId is required' })
  @Field()
  roundId: string;

  @Field(() => Float)
  @Min(0.01, { message: 'Chance must be greater than 0' })
  @Max(1, { message: 'Chance must be less than or equal to 1' })
  chance: number;
}

