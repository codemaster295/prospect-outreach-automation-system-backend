'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Contacts', 'firstName', {
      type: Sequelize.INTEGER,
      allowNull: true, // Set to false if you want to require this field
     })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Contacts', 'firstName'); // To revert the change
  }
};
