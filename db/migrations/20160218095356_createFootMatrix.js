exports.up = function up(knex) {
  return knex.schema.createTable('foot_matrix', function (table) {
    table.integer('source_id').references('id').inTable('foot_grid').index().notNullable();
    table.integer('destination_id').references('id').inTable('foot_grid').notNullable();
    table.float('time').notNullable();
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTable('foot_matrix');
};
