let express = require('express');
let router = express.Router();

let news = require('../models/News');


/* GET home page. */
router.get('/', function(req, res, next) {
  // news.fetchNewNews();
  news.getCategories()
  .then(cats =>{
      res.render('index', {cats});
  })
  .catch(err=>{
    console.log(err);
      res.send('error');
  });
});

module.exports = router;
