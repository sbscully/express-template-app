const winston = require('winston');
const express = require('express-winston');

const transports = [
  new (winston.transports.Console)({
    json: true,
    colorize: true,
    stringify: obj => JSON.stringify(obj),
  }),
];

express.requestWhitelist.push('body');

// eslint-disable-next-line
const access = new (express.logger)({ transports });
// eslint-disable-next-line
const error = new (express.errorLogger)({ transports });

module.exports = {
  access,
  error,
};
