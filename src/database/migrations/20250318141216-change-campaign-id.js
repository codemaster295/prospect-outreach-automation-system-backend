'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('campaigns', 'id', {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('campaigns', 'id', {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
        });
    },
};
