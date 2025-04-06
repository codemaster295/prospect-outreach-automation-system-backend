'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addConstraint('sentemails', {
            fields: ['campaignId'],
            type: 'foreign key',
            name: 'campaignId_ibfk_1',
            references: {
                table: 'campaigns',
                field: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        await queryInterface.addConstraint('sentemails', {
            fields: ['from'],
            type: 'foreign key',
            name: 'from_ibfk_1',
            references: {
                table: 'mailboxes',
                field: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        await queryInterface.addConstraint('sentemails', {
            fields: ['to'],
            type: 'foreign key',
            name: 'to_ibfk_1',
            references: {
                table: 'contacts',
                field: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint(
            'sentemails',
            'campaignId_ibfk_1',
        );
        await queryInterface.removeConstraint('sentemails', 'from_ibfk_1');
        await queryInterface.removeConstraint('sentemails', 'to_ibfk_1');
    },
};
