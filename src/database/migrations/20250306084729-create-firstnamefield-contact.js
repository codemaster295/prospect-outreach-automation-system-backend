'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Contacts', 'firstName', {
      type: Sequelize.STRING, // Change from INTEGER to STRING
      allowNull: true, // Set false if the field should be required
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Contacts', 'firstName', {
      type: Sequelize.INTEGER, // Revert back to INTEGER if needed
      allowNull: true,
    });
  }
};
