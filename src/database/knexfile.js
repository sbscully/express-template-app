const defaults = {
  client: 'postgresql',
  connection: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};

const config = {
  development: Object.assign({}, defaults, {}),
  test: Object.assign({}, defaults, {}),
  staging: Object.assign({}, defaults, {}),
  production: Object.assign({}, defaults, {}),
};

module.exports = config;
