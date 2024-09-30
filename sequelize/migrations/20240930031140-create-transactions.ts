import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('transactions', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      amount: {
        type: DataTypes.FLOAT.UNSIGNED,
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM('profit', 'bet', 'refund', 'campaign'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('approved', 'canceled'),
        allowNull: false,
        defaultValue: 'approved',
      },
      balance: {
        type: DataTypes.ENUM('real_balance', 'bonus_balance'),
        allowNull: false,
      },
      bet_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'bets',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      campaign_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'campaigns',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
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

    // Add index on user_id for faster queries
    await queryInterface.addIndex('transactions', ['user_id']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('transactions');
  },
};
