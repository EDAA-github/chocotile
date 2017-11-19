"use strict";
let express = require('express');
let router = express.Router();
let news = require('../models/News');


/** GET category page. */
router.get('/:num', function(req, res, next) {
  let num = parseInt(req.params['num']);
  let thisFeed;
  if( !isNaN( num)) {
      news.getFeed(num)
      .then(f => {
          if (f.length < 1){
              res.render('error', {message: 'Something bad happened', error:{status: 'No such feed'}});

              return false;
          }
          thisFeed = f[0];
          return news.updateFeedView(num)
      })
      .then(i => {
          thisFeed.views++;
          console.log(thisFeed);
          req.session.feed = { cat : thisFeed.id_cat, id: thisFeed.id};
          res.render('feed', {feed: thisFeed})
      })
      .catch(err => {
          console.log(err);
      })
  }
  else {
      res.render('error', {message: 'Something bad happened', error:{status: 'No such feed'}});

  }
});

/** ajax request */
router.post('/update-rating', function(req, res, next) {

    /** get user input */
    let ind = req.body.ind;
    let val = req.body.val;
    console.log(req.body);

    news.updateFeedRaring(val, ind)
    .then(record => {
        // console.log(record);
        /** password is bad */
        res.send('OK' + req.session.feed.cat);
    })
    .catch(err=>{
        console.log(err);
        res.send('&ERROR&');
    });
});

/** ajax request */
router.post('/get-similar', function(req, res, next) {
    let feedID = req.session.feed.id;
    console.log(feedID);

    // res.send('OK' + req.session.feed.cat);

    news.getSimilarNews(feedID)
        .then(record => {
            res.send(record);
        })
        .catch(err=>{
            console.log(err);
            res.send('&ERROR&');
        });
});
/** ajax request */
router.post('/pay', function(req, res, next) {
    let feedID = req.session.feed.id;
    news.updateNewsVIP(feedID)
        .then(record => {
            res.send('&OK&');
        })
        .catch(err=>{
            console.log(err);
            res.send('&ERROR&');
        });
});
module.exports = router;
