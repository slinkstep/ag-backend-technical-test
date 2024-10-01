import { InputType, Field, Float } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsString, Max, Min } from 'class-validator';


@InputType()
export class CreateBetInput {
  @Field(() => Float)
  @IsNumber()
  @Min(0.01)
  amount: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0.01)
  @Max(1)
  chance: number;

  @Field()
  @IsBoolean()
  isBonus: boolean;

  @Field()
  @IsBoolean()
  simulateSettlement: boolean;

  @Field()
  @IsString()
  roundId: string;
}
