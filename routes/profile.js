let express = require('express');
let router = express.Router();
let user = require('../models/User');

/* GET profile page. */
router.get('/', function(req, res, next) {

  if( !req.session.user ){
    /** redirect to login page */
    res.redirect('/login');
    return;
  }
  res.render('profile', {isLogged : !!req.session.user, name: req.session.user.name, number: req.session.user.number});
});

router.post('/user-orders', function(req, res, next) {
  if( !req.session.user ){
    res.send(JSON.stringify({error: 'no user'}));
    return;
  }
  user.getUserOrders(req.session.user.id)
  .then(result =>{
    console.dir(result);
    res.send(JSON.stringify(result));
  })
  .catch(err=>{
    console.log(err);
    res.send(JSON.stringify({error: 'some error'}));

  })
});
module.exports = router;
