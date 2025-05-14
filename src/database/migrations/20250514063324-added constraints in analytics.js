'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addConstraint('analytics', {
            fields: ['contactId'],
            type: 'foreign key',
            name: 'fk_analytics_contactId', // Custom constraint name
            references: {
                table: 'contacts',
                field: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });

        await queryInterface.addConstraint('analytics', {
            fields: ['sentEmailId'],
            type: 'foreign key',
            name: 'fk_analytics_sentEmailId', // Custom constraint name
            references: {
                table: 'sentemails',
                field: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint(
            'analytics',
            'fk_analytics_contactId',
        );
        await queryInterface.removeConstraint(
            'analytics',
            'fk_analytics_sentEmailId',
        );
    },
};
