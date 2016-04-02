'use strict';

exports.up = function up(knex) {
  return knex.schema.createExtension('postgis');
};

exports.down = function down(knex) {
  return knex.schema.dropExtension('postgis');
};
