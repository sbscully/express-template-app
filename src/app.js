const express = require('express');
const path = require('path');
const compression = require('compression');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
// const favicon = require('serve-favicon');
const methodOverride = require('method-override');
const layouts = require('express-ejs-layouts');
const enforce = require('express-sslify');
const _ = require('./services/utils');
const sessions = require('./services/sessions');
const logger = require('./services/logger');
const errors = require('./services/errors');
const routers = require('./routers');

// separate setup and initialization so that each
// request test can operate on an isolated app instance
const setup = (app) => {
  if (!(process.env.NODE_ENV === 'test')) {
    // access log setup
    app.use(logger.access);
  }

  if (process.env.NODE_ENV === 'production') {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
  }

  // session setup
  app.use(sessions.store);

  // view engine setup
  /* eslint-disable no-param-reassign */
  app.locals._ = _;
  app.locals.environment = process.env;
  /* eslint-enable no-param-reassign */

  app.use(flash());
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.use(layouts);

  // request parsing setup
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(methodOverride('_method'));

  // routing setup
  app.use(compression());
  // app.use(favicon(path.join(__dirname, '../public/images', 'favicon.ico')));
  app.use(express.static(path.join(__dirname, '../public')));
  app.use('/', routers);

  // error handling setup
  app.use(logger.error);
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;

    next(err);
  });

  app.use(errors.handler);

  return app;
};

module.exports = {
  setup,
  app: setup(express()),
};
