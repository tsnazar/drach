'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Artworks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      slug: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.ENUM,
        values: ['film', "poetry"]
      },
      poetryContent: {
        type: Sequelize.TEXT
      },
      filmURL: {
        type: Sequelize.STRING
      },
      filmGenre: {
        type: Sequelize.STRING
      },
      filmDescription: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Artworks');
  }
};