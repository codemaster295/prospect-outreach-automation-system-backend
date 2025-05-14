'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async transaction => {
            await queryInterface.addConstraint('analytics', {
                fields: ['campaignId'],
                type: 'foreign key',
                name: 'fk_analytics_campaignId',
                references: {
                    table: 'campaigns',
                    field: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                transaction,
            });
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async transaction => {
            await queryInterface.removeConstraint(
                'analytics',
                'fk_analytics_campaignId',
                {
                    transaction,
                },
            );
        });
    },
};
