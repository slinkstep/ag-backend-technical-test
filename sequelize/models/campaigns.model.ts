import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Transaction } from './transactions.model';
import { CampaignCategory, CampaignStatus } from './enums/enums';
import { Admin } from './admins.model';

@Table({ tableName: 'campaigns' })
export class Campaign extends Model<Campaign> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    field: 'promo_code',
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  promoCode: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.ENUM(...Object.values(CampaignCategory)),
    allowNull: false,
  })
  category: CampaignCategory;

  @Column({
    field: 'playable_balance_amount',
    type: DataType.FLOAT.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  })
  playableBalanceAmount: number;

  @Column({
    field: 'bonus_balance_amount',
    type: DataType.FLOAT.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  })
  bonusBalanceAmount: number;

  @Column({
    field: 'start_date',
    type: DataType.DATE,
    allowNull: false,
  })
  startDate: Date;

  @Column({
    field: 'end_date',
    type: DataType.DATE,
    allowNull: false,
  })
  endDate: Date;

  @Column({
    type: DataType.ENUM(...Object.values(CampaignStatus)),
    allowNull: false,
    defaultValue: CampaignStatus.ACTIVE,
  })
  status: CampaignStatus;

  @HasMany(() => Transaction)
  transactions: Transaction[];

  @ForeignKey(() => Admin)
  @Column({
    field: 'created_by',
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  createdBy: number;

  @BelongsTo(() => Admin)
  admin: Admin;

  @CreatedAt
  @Column({
    field: 'created_at',
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    field: 'updated_at',
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date;
}
