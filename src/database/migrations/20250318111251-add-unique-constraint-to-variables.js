'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('variables', 'name', {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        });

        await queryInterface.changeColumn('variables', 'value', {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('variables', 'name', {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false,
        });

        await queryInterface.changeColumn('variables', 'value', {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false,
        });
    },
};
