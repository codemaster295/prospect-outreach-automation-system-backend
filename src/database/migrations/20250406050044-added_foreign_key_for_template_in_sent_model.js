'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addConstraint('sentemails', {
            fields: ['template'],
            type: 'foreign key',
            name: 'template_ibfk_2',
            references: {
                table: 'templates',
                field: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint('sentemails', 'template_ibfk_2');
    },
};
