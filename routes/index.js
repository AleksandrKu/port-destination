const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Update fields "location" and "lastKnownRoute" on DEV' });
});

module.exports = router;
