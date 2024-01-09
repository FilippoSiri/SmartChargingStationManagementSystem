'use strict';
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({ message: 'User route' });
});

module.exports = router;