const express = require('express');
const app = require('./app');

const router = express.Router();

router.use('/', app);

module.exports = router;
