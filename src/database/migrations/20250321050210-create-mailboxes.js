'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('mailboxes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      senderEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Ensuring unique email addresses
      },  
      owner: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // provider: {
      //   type: Sequelize.ENUM('google', 'microsoft', 'smtp'),
      //   allowNull: false,
      // },
      provider:{
        type: Sequelize.ENUM,
        values: ['google', 'microsoft', 'smtp'],
        allowNull: false,
      },
      createdAt: {  
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,			
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('mailboxes');
  }
};
