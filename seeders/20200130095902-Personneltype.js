'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Personneltypes', [{
      name: 'admin',
      created_by: 1,
      created_at: new Date(),

    }, {
      name: 'scout',
      created_by: 1,
      created_at: new Date(),
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Personneltypes', null, {});
  }
};
