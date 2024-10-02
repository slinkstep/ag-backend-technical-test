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
import { BetStatus } from './enums/enums';

@Table({ tableName: 'bets' })
export class Bet extends Model<Bet> {
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
    type: DataType.FLOAT.UNSIGNED,
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  chance: number;

  @Column({
    type: DataType.FLOAT.UNSIGNED,
    allowNull: true,
    validate: {
      min: 0,
    },
  })
  payout: number;

  @Column({
    field: 'round_id',
    type: DataType.STRING(100),
    allowNull: false,
  })
  roundId: string;

  @Column({
    type: DataType.FLOAT.UNSIGNED,
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  margin: number;

  @Column({
    field: 'is_bonus',
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isBonus: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  win: boolean;

  @Column({
    type: DataType.ENUM(...Object.values(BetStatus)),
    allowNull: false,
    defaultValue: BetStatus.OPEN,
  })
  status: BetStatus;

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
