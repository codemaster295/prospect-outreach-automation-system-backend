'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Make 'to' column nullable
    await queryInterface.changeColumn('sentemails', 'to', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    // Add the foreign key constraint
    await queryInterface.addConstraint('sentemails', {
      fields: ['to'],
      type: 'foreign key',
      name: 'fk_sentemails_to_contacts',
      references: {
        table: 'contacts',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('sentemails', 'fk_sentemails_to_contacts');

    // Revert 'to' column to NOT NULL if needed
    await queryInterface.changeColumn('sentemails', 'to', {
      type: Sequelize.UUID,
      allowNull: false,
    });
  },
};
