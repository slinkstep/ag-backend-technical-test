import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      real_balance: {
        type: DataTypes.FLOAT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      bonus_balance: {
        type: DataTypes.FLOAT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      auth_provider_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      auth_provider_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'blocked'),
        allowNull: false,
        defaultValue: 'active',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('users');
  },
};

