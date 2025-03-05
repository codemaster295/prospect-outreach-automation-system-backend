'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Contacts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fileId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      firstPhone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      employees: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      industry: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      personLinkedinUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      companyLinkedinUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      companyAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      companyCity: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      companyState: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      	companyCountry: {
        type: Sequelize.STRING,
        allowNull: true,
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
    }).then(() => {
      return queryInterface.addIndex('Contacts', ['email'], { unique: true });
    });
  },

  async down (queryInterface, Sequelize) {  
    await queryInterface.dropTable('Contacts');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
