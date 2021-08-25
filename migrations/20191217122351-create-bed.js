'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Beds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      from: { //range of the first bed from - used to be called number
        allowNull: true,
        type: Sequelize.INTEGER
      },
      to: { //range of the last bed tio - used to be called bed_number
        allowNull: true,
        type: Sequelize.INTEGER
      },
      bed_name: {
        type: Sequelize.STRING
      },
      block_id: {
        type: Sequelize.INTEGER
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
      updated_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Beds');
  }
};