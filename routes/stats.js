var express = require('express');
var router = express.Router();

/* GET stats page. */
router.get('/', function(req, res, next) {
  res.render('stats', { title: 'Know Mow Stats', page: 'stats' });
});

module.exports = router;
