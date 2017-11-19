"use strict";
let express = require('express');
let router = express.Router();
let pass = require('../functions/password');
let user = require('../models/User');

/** GET register page. */
router.get('/', function(req, res, next) {
  if(req.session.user){
    res.redirect('/');
    return;
  }
  res.render('register');
});

/** ajax request */
router.post('/', function(req, res, next) {
  /** get user input */
  let name = req.body.name;
  let number = req.body.number;
  let password = req.body.password;

  user.getUserByNumber(number)
  .then(record => {

    /** check is user exist with this number */
    if(record.length > 0){
      res.send('&USER_EXIST&');
      return;
    }
    return user.insertUser(name, number, pass.hash(password))
  })
  .then(insertId => {
    console.log(insertId);
    req.session.user = {
      id: insertId,
      name : name,
      number : number,
      email: null
    };
    res.send('&OK&');
  })
  .catch(err=>{
    console.log(err);
  });
  // res = setHeaders(res);
});




module.exports = router;
