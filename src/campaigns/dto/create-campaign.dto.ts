import {
  IsString,
  Length,
  IsEnum,
  IsNumber,
  Min,
  IsDateString,
} from 'class-validator';

import { CampaignCategory, CampaignStatus } from 'sequelize/models/enums/enums';

export class CreateCampaignDto {
  @IsString({ message: 'promoCode must be a string.' })
  @Length(1, 100, {
    message: 'promoCode must be between 1 and 100 characters.',
  })
  promoCode: string;

  @IsString({ message: 'name must be a string.' })
  @Length(1, 100, { message: 'name must be between 1 and 100 characters.' })
  name: string;

  @IsEnum(CampaignCategory, {
    message: `category must be one of the following values: ${Object.values(
      CampaignCategory,
    ).join(', ')}`,
  })
  category: CampaignCategory;

  @IsNumber({}, { message: 'playableBalanceAmount must be a number.' })
  @Min(0, { message: 'playableBalanceAmount must be at least 0.' })
  playableBalanceAmount: number = 0;

  @IsNumber({}, { message: 'bonusBalanceAmount must be a number.' })
  @Min(0, { message: 'bonusBalanceAmount must be at least 0.' })
  bonusBalanceAmount: number = 0;

  @IsString({ message: 'startDate must be a valid date string.' })
  @IsDateString(
    {},
    { message: 'startDate must be a valid ISO 8601 date string.' },
  )
  startDate: string;

  @IsString({ message: 'endDate must be a valid date string.' })
  @IsDateString(
    {},
    { message: 'endDate must be a valid ISO 8601 date string.' },
  )
  endDate: string;

  @IsEnum(CampaignStatus, {
    message: `status must be one of the following values: ${Object.values(
      CampaignStatus,
    ).join(', ')}`,
  })
  status: CampaignStatus;
}
