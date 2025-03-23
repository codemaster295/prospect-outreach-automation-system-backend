'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('campaigns', 'status', {
            type: Sequelize.ENUM,
            allowNull: false,
            defaultValue: 'draft',
            values: ['draft', 'running', 'completed'],
        });
        await queryInterface.addColumn('campaigns', 'mailbox', {
            type: Sequelize.UUIDV4,
            allowNull: true,
            defaultValue: null,
        });
        await queryInterface.addConstraint('campaigns', {
            fields: ['mailbox'],
            type: 'foreign key',
            name: 'mailbox_fk',
            references: {
                table: 'mailboxes',
                field: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint('campaigns', 'mailbox_fk');
        await queryInterface.removeColumn('campaigns', 'status');
        await queryInterface.removeColumn('campaigns', 'mailbox');
    },
};
