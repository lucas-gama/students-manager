'use strict';
const students = require('./mocks/students.ts');
/** @type {import('sequelize-cli').Migration} */
(
  module.exports = {
    async up(queryInterface) {
      await queryInterface.bulkInsert('student', students);
    },

    async down(queryInterface) {
      await queryInterface.bulkDelete('student', null, {});
    },
  }
);
