//import express from 'express';
var express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Know Mow', page: 'home'});
});

module.exports = router;
//export default router;
