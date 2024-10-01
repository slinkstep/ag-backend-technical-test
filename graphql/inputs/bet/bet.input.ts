import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsNumber, IsString, Min } from 'class-validator';


@InputType()
export class CreateBetInput {
  @Field(() => Int)
  @IsInt()
  userId: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0.01)
  amount: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0.01)
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
