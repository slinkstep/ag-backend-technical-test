import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
  IsInt,
} from 'class-validator';
import {
  TransactionCategory,
  TransactionStatus,
  BalanceType,
} from 'sequelize/models/enums/enums';

export class CreateTransactionDto {
  @IsInt({ message: 'User ID must be an integer.' })
  @IsNotEmpty({ message: 'User ID is required.' })
  userId: number;

  @IsNumber({}, { message: 'Amount must be a number.' })
  @IsPositive({ message: 'Amount must be a positive number.' })
  amount: number;

  @IsEnum(TransactionCategory, { message: 'Invalid transaction category.' })
  category: TransactionCategory;

  @IsEnum(TransactionStatus, { message: 'Invalid transaction status.' })
  status: TransactionStatus;

  @IsEnum(BalanceType, { message: 'Invalid balance type.' })
  balance: BalanceType;

  @IsOptional()
  @IsInt({ message: 'Bet ID must be an integer.' })
  betId?: number;

  @IsOptional()
  @IsInt({ message: 'Campaign ID must be an integer.' })
  campaignId?: number;
}
