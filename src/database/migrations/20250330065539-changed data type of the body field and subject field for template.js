'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('templates', 'body', {
            type: Sequelize.TEXT,
            maxLength: 5000,
        });
        await queryInterface.changeColumn('templates', 'subject', {
            type: Sequelize.TEXT,
            maxLength: 500,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('templates', 'body', {
            type: Sequelize.STRING,
        });
        await queryInterface.changeColumn('templates', 'subject', {
            type: Sequelize.STRING,
        });
    },
};
