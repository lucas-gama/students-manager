'use strict';
const relations = require('./mocks/relations.ts');
/** @type {import('sequelize-cli').Migration} */
(
  module.exports = {
    async up(queryInterface) {
      await queryInterface.bulkInsert('student_class', relations);
    },

    async down(queryInterface) {
      await queryInterface.bulkDelete('student_class', null, {});
    },
  }
);
