'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeIndex('contacts', ['email']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addIndex('contacts', ['email'], {
            unique: true,
        });
    },
};
