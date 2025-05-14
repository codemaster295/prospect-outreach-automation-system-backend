'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async transaction => {
            // Add campaignId column
            await queryInterface.addColumn(
                'analytics',
                'campaignId',
                {
                    type: Sequelize.UUID,
                    allowNull: true,
                    references: {
                        model: 'campaigns',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                },
                { transaction },
            );
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async transaction => {
            // Remove campaignId column
            await queryInterface.removeColumn('analytics', 'campaignId', {
                transaction,
            });
        });
    },
};
