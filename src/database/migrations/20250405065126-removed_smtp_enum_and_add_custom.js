'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Step 1: Update 'smtp' to 'custom' before altering enum
        await queryInterface.sequelize.query(`
      UPDATE \`mailboxes\`
      SET \`provider\` = 'custom'
      WHERE \`provider\` = 'smtp';
    `);

        // Step 2: Change the ENUM definition to remove 'smtp' and add 'custom'
        await queryInterface.changeColumn('mailboxes', 'provider', {
            type: Sequelize.ENUM('google', 'microsoft', 'custom'),
            allowNull: false,
        });
    },

    async down(queryInterface, Sequelize) {
        // Step 1: Revert 'custom' back to 'smtp'
        await queryInterface.sequelize.query(`
      UPDATE \`mailboxes\`
      SET \`provider\` = 'smtp'
      WHERE \`provider\` = 'custom';
    `);

        // Step 2: Restore original ENUM
        await queryInterface.changeColumn('mailboxes', 'provider', {
            type: Sequelize.ENUM('google', 'microsoft', 'smtp'),
            allowNull: false,
        });
    },
};
