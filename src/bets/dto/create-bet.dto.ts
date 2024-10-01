import {
  IsInt,
  IsNumber,
  IsBoolean,
  Min,
  Max,
  IsPositive,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { BetStatus } from 'sequelize/models/enums/enums';

export class CreateBetDto {
  @IsInt({ message: 'userId must be an integer.' })
  @IsPositive({ message: 'userId must be a positive number.' })
  userId: number;

  @IsNumber({}, { message: 'amount must be a number.' })
  @Min(0.01, { message: 'amount must be at least 0.01.' })
  amount: number;

  @IsNumber({}, { message: 'chance must be a number.' })
  @Min(0, { message: 'chance cannot be less than 0.' })
  @Max(1, { message: 'chance cannot be greater than 1.' })
  chance: number;

  @IsString({ message: 'roundId must be a string.' })
  roundId: string;

  @IsNumber({}, { message: 'amount must be a number.' })
  @IsPositive()
  margin: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  payout?: number;

  @IsOptional()
  @IsBoolean()
  win?: boolean;

  @IsEnum(BetStatus, { message: 'Invalid transaction category.' })
  status?: BetStatus;
}
