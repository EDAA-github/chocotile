"use strict";
let express = require('express');
let pass = require('../functions/password');
let user = require('../models/User');

// let setHeaders = require('../functions/setHeaders');
let router = express.Router();


/** GET login page. */
router.get('/', function(req, res, next) {
  if(req.session.user){
    res.redirect('/');
    return;
  }
  res.render('login');
});

/** ajax request */
router.post('/', function(req, res, next) {
  /** get user input */
  let number = req.body.number;
  let password = req.body.password;

  user.getUserByNumber(number)
    .then(record => {

      /** check is user exist */
      if(record.length === 0){
        res.send('&NO_USER&');
        return;
      }

      /** user exist and password is good */
      if(pass.check(password, record[0].password)){
        req.session.user = {
          id: record[0].id,
          name : record[0].name,
          number : number,
          email: record[0].email
        };
        res.send('&OK&');
        return;
      }

      /** password is bad */
      res.send('&BAD_PASS&');
    })
    .catch(err=>{
      console.log(err);
    });
  // res = setHeaders(res);
});

module.exports = router;
