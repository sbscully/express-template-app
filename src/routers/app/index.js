const express = require('express');
const actions = require('../../services/actions');

const router = express.Router();

router.use(actions({ views: 'app', layout: 'layout' }));

router.get('/', async (req, res) => {
  res.action('index');
});

module.exports = router;
