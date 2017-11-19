"use strict";
let express = require('express');
let router = express.Router();
let news = require('../models/News');


/** GET category page. */
router.get('/:cat', function(req, res, next) {
  let catID = parseInt(req.params['cat']);
  if( !isNaN( catID)) {
      let catInfo;
      news.getCategory(catID)
          .then(c => {
              if (c.length < 1){
                     res.render('error', {message: 'Something bad happened', error:{status: 'No such category'}});
                return false;
              }
              catInfo = c[0];
              return news.getNewsCategory(catID)
          })
          .then(result => {
            console.log(catInfo);
              res.render('category', {news: result, cat: catInfo, helpers:{
                  checkVIP: function (val) {
                      return val === 1;
                  }
              }});
          })
          .catch(err => {
              console.log(err);
              res.render('error', {message: 'Something bad happened', error:{status: 'Ooops..'}});

          })
  }
  else if(req.params['cat'].trim() === 'recommends'){
      console.log('GOGOGOGOGOG');
      news.getVIPNews()
          .then(c => {
              if (c.length < 1){
                  res.render('error', {message: 'Something bad happened', error:{status: 'No such category'}});

                  return false;
              }
              res.render('category', {news: c, cat: {name: 'EDAA рекомендує'}});
          })
          .catch(err => {
              console.log(err);
              res.render('error', {message: 'Something bad happened', error:{status: 'Ooops..'}});

          })
  }
  else if(req.params['cat'].trim() === 'best'){
      news.getBestNews()
          .then(c => {
              if (c.length < 1){
                  res.render('error', {message: 'Something bad happened', error:{status: 'No such category'}});

                  return false;
              }
              res.render('category', {news: c, cat: {name: 'Найкраще'}});
          })
          .catch(err => {
              console.log(err);
              res.render('error', {message: 'Something bad happened', error:{status: 'Ooops..'}});

          })
  }
});





module.exports = router;
