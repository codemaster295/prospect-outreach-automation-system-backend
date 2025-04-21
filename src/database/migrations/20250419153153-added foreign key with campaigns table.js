'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addConstraint('schedules', {
            fields: ['campaign'],
            type: 'foreign key',
            name: 'fk_campaign_id_schedule',
            references: {
                table: 'campaigns',
                field: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint(
            'schedules',
            'fk_campaign_id_schedule',
        );
    },
};
