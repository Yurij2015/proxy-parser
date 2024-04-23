'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('parsed_proxies', 'mobile', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    });
    await queryInterface.addColumn('parsed_proxies', 'hosting', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    });
    await queryInterface.addColumn('parsed_proxies', 'status', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('parsed_proxies', 'ssl', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    });
    await queryInterface.addColumn('parsed_proxies', 'protocol', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('parsed_proxies', 'mobile');
    await queryInterface.removeColumn('parsed_proxies', 'hosting');
    await queryInterface.removeColumn('parsed_proxies', 'status');
    await queryInterface.removeColumn('parsed_proxies', 'ssl');
    await queryInterface.removeColumn('parsed_proxies', 'protocol');
  }
};
