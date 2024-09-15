'use strict';
const classes = require('./mocks/classes.ts');
/** @type {import('sequelize-cli').Migration} */
(
  module.exports = {
    async up(queryInterface) {
      await queryInterface.bulkInsert('class', classes);
    },

    async down(queryInterface) {
      await queryInterface.bulkDelete('class', null, {});
    },
  }
);
