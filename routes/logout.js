"use strict";
let express = require('express');
let router = express.Router();


router.get('/', function(req, res, next) {
  if(req.session.user){
    req.session.user = null;
  }
  res.redirect('/');
});


module.exports = router;
