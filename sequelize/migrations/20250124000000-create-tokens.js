'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tokens', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_wallet: {
        type: Sequelize.STRING(44),
        allowNull: false,
      },
      token_name: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      symbol: {
        type: Sequelize.STRING(16),
        allowNull: false,
      },
      mint_address: {
        type: Sequelize.STRING(44),
        allowNull: false,
        unique: true,
      },
      supply: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      fee_paid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tokens');
  },
};
