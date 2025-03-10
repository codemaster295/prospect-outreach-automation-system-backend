'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('contacts', 'email', {
            type: Sequelize.STRING,
            unique: false,
        });
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('contacts', 'email', {
            type: Sequelize.STRING,
            unique: true,
        });
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
    },
};
