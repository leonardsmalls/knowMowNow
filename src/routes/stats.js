var express = require('express');
//import express from 'express';
const router = express.Router();

/* GET stats page. */
router.get('/', function(req, res, next) {
  res.render('stats', { title: 'Know Mow Stats', page: 'stats' });
});

//export default router;
module.exports = router;
