'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Personnel', [{
      first_name: 'William',
      last_name: 'Wamwalo',
      phone: '0700000000',
      status: 1,
      personnel_type_id: 1,
      password: '$2a$10$ECdOnZkH6ZRE9jzvUst4x.PNqKwgSHcaoceTxazjMRg1VojEpHh6S',
      created_by: 1,
      modified_by: null,
      reset_password: 0

    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Personnel', null, {});
  }
};
