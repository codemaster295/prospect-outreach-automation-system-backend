'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('analytics', 'key', {
            type: Sequelize.ENUM(
                'open_tracking',
                'bounce_tracking',
                'complaint_tracking',
                'spam_tracking',
                'forgiven_tracking',
                'delivered_tracking',
                'failed_tracking',
                'read_tracking',
                'unread_tracking',
                'clicked_tracking',
                'unclicked_tracking',
                'subscribed_tracking',
                'unsubscribed_tracking',
                'sent_tracking',
            ),
            allowNull: false,
        });
    },

    async down(queryInterface, Sequelize) {
        // Optional: revert to original values
        await queryInterface.changeColumn('analytics', 'key', {
            type: Sequelize.ENUM('open_tracking', 'click_tracking'),
            allowNull: false,
        });
    },
};
