'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('tokens', 'decimals', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 9,
    });

    await queryInterface.addColumn('tokens', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('tokens', 'logo_uri', {
      type: Sequelize.STRING(500),
      allowNull: true,
    });

    await queryInterface.addColumn('tokens', 'website', {
      type: Sequelize.STRING(500),
      allowNull: true,
    });

    await queryInterface.addColumn('tokens', 'twitter', {
      type: Sequelize.STRING(500),
      allowNull: true,
    });

    await queryInterface.addColumn('tokens', 'telegram', {
      type: Sequelize.STRING(500),
      allowNull: true,
    });

    await queryInterface.addColumn('tokens', 'discord', {
      type: Sequelize.STRING(500),
      allowNull: true,
    });

    await queryInterface.addColumn('tokens', 'metadata_uri', {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('tokens', 'decimals');
    await queryInterface.removeColumn('tokens', 'description');
    await queryInterface.removeColumn('tokens', 'logo_uri');
    await queryInterface.removeColumn('tokens', 'website');
    await queryInterface.removeColumn('tokens', 'twitter');
    await queryInterface.removeColumn('tokens', 'telegram');
    await queryInterface.removeColumn('tokens', 'discord');
    await queryInterface.removeColumn('tokens', 'metadata_uri');
  },
};
