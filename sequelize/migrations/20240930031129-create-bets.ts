import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('bets', {
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
      chance: {
        type: DataTypes.FLOAT.UNSIGNED,
        allowNull: false,
      },
      payout: {
        type: DataTypes.FLOAT.UNSIGNED,
        allowNull: true,
      },
      round_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      margin: {
        type: DataTypes.FLOAT.UNSIGNED,
        allowNull: false,
      },
      is_bonus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      win: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('open', 'settled', 'rollBacked'),
        allowNull: false,
        defaultValue: 'open',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add index on user_id for faster queries
    await queryInterface.addIndex('bets', ['user_id']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('bets');
  },
};
