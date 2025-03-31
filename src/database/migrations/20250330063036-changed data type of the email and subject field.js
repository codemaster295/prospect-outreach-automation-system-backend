'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('sentemails', 'email', {
            type: Sequelize.TEXT,
        });
        await queryInterface.changeColumn('sentemails', 'subject', {
            type: Sequelize.TEXT,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('sentemails', 'email', {
            type: Sequelize.STRING,
        });
        await queryInterface.changeColumn('sentemails', 'subject', {
            type: Sequelize.STRING,
        });
    },
};
