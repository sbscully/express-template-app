const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const { database } = require('../database');

const store = session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  store: new KnexSessionStore({ knex: database }),
});

module.exports = {
  store,
};
