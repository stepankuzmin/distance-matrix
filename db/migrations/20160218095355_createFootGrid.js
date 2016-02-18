exports.up = function(knex) {
  return knex.schema.createTable('foot_grid', function (table) {
    table.increments('id').primary().index().unique().notNullable();
    table.specificType('cell', 'geometry(POLYGON, 4326)').index('cell_geometry', 'GIST').notNullable();
    table.specificType('centroid', 'geometry(POINT, 4326)').index('centroids_geometry', 'GIST').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('foot_grid');
};
