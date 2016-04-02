'use strict';

module.exports = {

  development: {
    debug: true,
    client: 'postgresql',
    connection: {
      database: 'matrix'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
