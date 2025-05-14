'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('analytics', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            contactId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'contacts',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            sentEmailId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'sentemails',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            key: {
                type: Sequelize.ENUM('open_tracking', 'click_tracking'),
                allowNull: false,
            },
            value: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal(
                    'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
                ),
            },
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('analytics');
    },
};
