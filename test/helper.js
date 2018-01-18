const express = require('express');
const fs = require('fs');
const request = require('supertest');
const chai = require('chai');
const cheerio = require('cheerio');
const nock = require('nock');
const { setup } = require('../src/app');

chai.use(require('chai-like'));
chai.use(require('chai-things'));
chai.use(require('chai-string'));

const helper = {
  cheerio,
  nock,
  expect: chai.expect,
  request,
  app() {
    // isolated app instance
    return setup(express());
  },
  fixturePath(fileName) {
    return `${process.cwd()}/test/fixtures/${fileName}`;
  },
  fixture(fileName) {
    return new Promise((resolve, reject) => {
      const pathName = helper.fixturePath(fileName);

      fs.readFile(pathName, 'utf8', (err, data) => {
        if (err) { reject(err); }
        resolve(data);
      });
    });
  },
};

module.exports = helper;
