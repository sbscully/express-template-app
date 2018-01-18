const knex = require('knex');
const config = require('./knexfile')[process.env.NODE_ENV];

const database = knex(config);
const bookshelf = require('bookshelf')(database);

bookshelf.plugin('registry'); // Resolve circular dependencies with relations

module.exports = {
  database,
  bookshelf,
};
