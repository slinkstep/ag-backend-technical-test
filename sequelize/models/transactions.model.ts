import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './users.model';
import { Bet } from './bets.model';
import { Campaign } from './campaigns.model';
import {
  TransactionCategory,
  TransactionStatus,
  BalanceType,
} from './enums/enums';

@Table({ tableName: 'transactions' })
export class Transaction extends Model<Transaction> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    field: 'user_id',
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.FLOAT.UNSIGNED,
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  amount: number;

  @Column({
    type: DataType.ENUM(...Object.values(TransactionCategory)),
    allowNull: false,
  })
  category: TransactionCategory;

  @Column({
    type: DataType.ENUM(...Object.values(TransactionStatus)),
    allowNull: false,
    defaultValue: TransactionStatus.APPROVED,
  })
  status: TransactionStatus;

  @Column({
    type: DataType.ENUM(...Object.values(BalanceType)),
    allowNull: false,
  })
  balance: BalanceType;

  @ForeignKey(() => Bet)
  @Column({
    field: 'bet_id',
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
  })
  betId?: number;

  @BelongsTo(() => Bet)
  bet?: Bet;

  @ForeignKey(() => Campaign)
  @Column({
    field: 'campaign_id',
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
  })
  campaignId?: number;

  @BelongsTo(() => Campaign)
  campaign?: Campaign;

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
