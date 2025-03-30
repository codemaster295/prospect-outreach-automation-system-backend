'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeIndex('mailboxes', 'senderEmail');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addIndex('mailboxes', ['senderEmail'], {
            unique: true,
            name: 'senderEmail', // Explicitly setting the name
        });
    },
};
