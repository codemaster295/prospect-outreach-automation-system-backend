'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('contacts', 'firstName', {
            type: Sequelize.TEXT('medium'),
            allowNull: true,
        });

        await queryInterface.changeColumn('contacts', 'lastName', {
            type: Sequelize.TEXT('medium'),
            allowNull: true,
        });

        await queryInterface.changeColumn('contacts', 'title', {
            type: Sequelize.TEXT('long'),
            allowNull: true,
        });

        await queryInterface.changeColumn('contacts', 'companyName', {
            type: Sequelize.TEXT('long'),
            allowNull: true,
        });

        await queryInterface.changeColumn('contacts', 'industry', {
            type: Sequelize.TEXT('long'),
            allowNull: true,
        });

        await queryInterface.changeColumn('contacts', 'personLinkedinUrl', {
            type: Sequelize.TEXT('long'),
            allowNull: true,
        });

        await queryInterface.changeColumn('contacts', 'companyAddress', {
            type: Sequelize.TEXT('long'),
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        // Optional: revert back to previous data types if known
        await queryInterface.changeColumn('contacts', 'firstName', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.changeColumn('contacts', 'lastName', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.changeColumn('contacts', 'title', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.changeColumn('contacts', 'companyName', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.changeColumn('contacts', 'industry', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.changeColumn('contacts', 'personLinkedinUrl', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.changeColumn('contacts', 'companyAddress', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },
};
