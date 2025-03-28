'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('sentemails', 'template', {
      type: Sequelize.UUID, // Use Sequelize.UUID instead of Sequelize.UUIDV4 for column type
      allowNull: false, // Allow NULL values
     });
   await queryInterface.addConstraint('sentemails', {
     fields: ['template'],
     type: 'foreign key',
     name: 'templates_ibfk_1',
    references: {
        table: 'templates',
        field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
     });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeConstraint('sentemails', 'templates_ibfk_1');
   await queryInterface.changeColumn('sentemails', 'template', {
    type: Sequelize.STRING,
    allowNull: false,
    });
  }
};
