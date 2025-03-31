'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('sentemails', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
    },
    messageId: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      campaignId: {
          type: Sequelize.UUID,
          allowNull: false,
      },
      from: {
          type: Sequelize.UUID,
          allowNull: false,
      },
      to: {
          type: Sequelize.UUID, // Storing `interval` and `unit` as JSON
          allowNull: false,
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      template: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      owner: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('sentemails');

  }
};
