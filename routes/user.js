const express = require('express');
const router = express.Router();
const Users = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Add users. */
router.get('/signup', function(req, res, next) {
    console.log(req.body)
    // Users.use
    res.send('respond with a resource');
});

module.exports = router;