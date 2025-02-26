module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ContactFiles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      fileUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      uploadedBy: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ContactFiles')
  },
}
