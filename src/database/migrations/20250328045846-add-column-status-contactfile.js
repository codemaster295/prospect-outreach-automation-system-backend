'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('contacts', 'status', {
      type: Sequelize.ENUM,
      allowNull: true,
      defaultValue: 'pending',
      values: ['pending', 'sent', 'failed'],
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('contacts', 'status');
  }
};
