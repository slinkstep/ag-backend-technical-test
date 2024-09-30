import {
    Table,
    Column,
    Model,
    DataType,
    HasMany,
    DefaultScope,
    UpdatedAt,
    CreatedAt,
  } from 'sequelize-typescript';
  import { Bet } from './bets.model';
  import { Transaction } from './transactions.model';
  import { UserStatus } from './enums/enums';
  
  @DefaultScope(() => ({
    attributes: { exclude: ['authProviderId'] },
  }))
  @Table({ tableName: 'users' })
  export class User extends Model<User> {
    @Column({
      type: DataType.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;
  
    @Column({
      type: DataType.STRING(100),
      allowNull: false,
    })
    name: string;
  
    @Column({
      field: 'real_balance',
      type: DataType.FLOAT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    })
    realBalance: number;
  
    @Column({
      field: 'bonus_balance',
      type: DataType.FLOAT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    })
    bonusBalance: number;
  
    @Column({
      field: 'auth_provider_id',
      type: DataType.STRING(255),
      allowNull: false,
      unique: true,
    })
    authProviderId: string;
  
    @Column({
      field: 'auth_provider_email',
      type: DataType.STRING(255),
      allowNull: false,
      unique: true,
    })
    authProviderEmail: string;
  
    @Column({
      type: DataType.ENUM(...Object.values(UserStatus)),
      allowNull: false,
      defaultValue: UserStatus.ACTIVE,
    })
    status: UserStatus;
  
    @HasMany(() => Bet)
    bets: Bet[];
  
    @HasMany(() => Transaction)
    transactions: Transaction[];
  
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
  