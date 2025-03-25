'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('campaigns', 'audience', {
            type: Sequelize.UUID, // Use Sequelize.UUID instead of Sequelize.UUIDV4 for column type
            allowNull: true, // Allow NULL values
        });

        await queryInterface.changeColumn('campaigns', 'template', {
            type: Sequelize.UUID,
            allowNull: true,
        });

        await queryInterface.changeColumn('campaigns', 'delay', {
            type: Sequelize.JSON,
            allowNull: true,
        });
        await queryInterface.addColumn('campaigns', 'owner', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('campaigns', 'audience', {
            type: Sequelize.UUID,
            allowNull: false, // Revert back to NOT NULL
        });

        await queryInterface.changeColumn('campaigns', 'template', {
            type: Sequelize.UUID,
            allowNull: false,
        });

        await queryInterface.changeColumn('campaigns', 'delay', {
            type: Sequelize.JSON,
            allowNull: false,
        });

        await queryInterface.removeColumn('campaigns', 'owner');
    },
};
