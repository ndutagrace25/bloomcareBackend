'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Scouts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      scouting_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      plant_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      entry_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      point_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      issue_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      issue_category_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      value: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      tolerance_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      latitude: {
        type: Sequelize.DECIMAL
      },
      longitude: {
        type: Sequelize.DECIMAL
      },
      created_by: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      modified_by: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_AT: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Scouts');
  }
};