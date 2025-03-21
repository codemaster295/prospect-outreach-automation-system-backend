'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addConstraint('mailboxconfig', {
            fields: ['mailbox'],
            type: 'foreign key',
            name: 'mailbox_ibfk_1',
            references: {
                table: 'mailboxes',
                field: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint(
            'mailboxconfig',
            'mailbox_ibfk_1',
        );
    },
};
