'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('campaigns',{
      fields:['audience'],
      type: "foreign key", 
      name: "audience_ibfk_1",
      references: {
        table: "files",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })
    await queryInterface.addConstraint('campaigns',{
      fields:['template'],
      type: "foreign key", 
      name: "template_ibfk_1",
      references: {
        table: "templates",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('campaigns', 'audience_ibfk_1');
    await queryInterface.removeConstraint('campaigns', 'template_ibfk_1');
  }
};
