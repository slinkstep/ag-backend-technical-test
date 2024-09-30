import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DefaultScope,
} from 'sequelize-typescript';
import { UserStatus } from './enums/enums';

@DefaultScope(() => ({
  attributes: { exclude: ['authProviderId'] },
}))
@Table({ tableName: 'admins' })
export class Admin extends Model<Admin> {
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
