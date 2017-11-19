let db = require('../db');
const bluebird = require('bluebird');
const jsdom = require('jsdom');
const request = bluebird.promisifyAll(require('request'), {multiArgs: true});
const { JSDOM } = jsdom;
const slashes = require('slashes');
let connection = db.connection;
let badWords = ['затор','тітуш','небезпек','страйк','помер','вбив','вбил','епідем','пожеж','чум','вибух','горів','смерт','п\'ян','вкрав','гвалт','жертв','страх','бомб','збро','ядерн','стражд','мучив','злодій','злочин','крадіж','горінн','стріл','дтп','банд','напав','напала','напали','підстрел','поране','диверс'];
let myImages = ['assets/images/news.jpg', 'assets/images/news1.jpg', 'assets/images/news2.jpg', 'assets/images/news3.jpg', 'assets/images/news4.jpg'];

let fetchNewNews = function() {

  return new Promise(function (resolve, reject) {
    connection.query('SELECT * FROM sources_for_categories', function (err, results, fields) {
      if (err) reject(err);

      resolve(results);
    });
  })
  .then(source =>{
    return bluebird.map(source, function (feed) {
      return processUrl({site : feed.id_source, cat : feed.id_category, url : feed.url})
    })
  })
  /** get start info */
  .then(news =>{
    //TODO  если есть такой заголовок в новостях, то убрать
    // console.log('ONE SITE CAT');
    // console.dir(news[0], 4);
    return new Promise(function (resolve, reject) {
      resolve(news);
    })
  })
  /* get full info*/
  .then(news =>{
    /** преобразовать новости в новости с категориями и сайтом */
    let customTypeNews = [];
    news.forEach(item => {
      item.news.forEach(n=>{
        n.category = item.category;
        n.site = item.site;
        customTypeNews.push(n);
      })
    });

    // TODO FOR tEST
    // news.forEach(item => {
    //   if(item.site === 2) {
    //       item.news.forEach(n => {
    //
    //           n.category = item.category;
    //           n.site = item.site;
    //           customTypeNews.push(n);
    //       })
    //   }
    // });
    console.log('customTypeNews');
    console.log(customTypeNews.length);
    return bluebird.map(customTypeNews.slice(500, 600), function (item) {
      // return processNewsItem({site : feed.id_source, cat : feed.id_category, url : feed.url})
      return processNewsItem(item)
    })
  })
  .then(result=>{
    "use strict";
      console.log('RRRRRR');
      result.forEach(r => {
           new Promise(function (resolve, reject) {
              connection.query('INSERT INTO news (id_cat, title, description, url, date, tags, body, image, is_good, icon) VALUES (?,?,?,?,?,?,?,?,?,?)',[r.category,r.title, r.desc, r.link, r.newsDate, r.newsTags.join(';'), r.newsBody, r.image, r.isGood, r.icon ], function (error, result) {
                  if (error) {
                      reject(error);
                  }
                  console.log('result');

                  console.log(result);
                  resolve(result);
              });
          });
      });
  })

  .catch(err=>{
    "use strict";
    console.log(err);
  })
};

let getCategory = function (i) {
    return new Promise(function (resolve, reject) {
        connection.query('SELECT * FROM categories WHERE id = ?',[i], function (error, results) {
            if (error) {
                reject(error);
            }
            resolve(results);
        });
    });
};

let getVIPNews = function () {
    return new Promise(function (resolve, reject) {
        connection.query('SELECT * FROM news WHERE vip = 1', function (error, results) {
            if (error) {
                reject(error);
            }
            resolve(results);
        });
    });
};
let getBestNews = function () {
    return new Promise(function (resolve, reject) {
        connection.query('SELECT * FROM news ORDER by rating DESC limit 18', function (error, results) {
            if (error) {
                reject(error);
            }
            resolve(results);
        });
    });
};
let getFeed = function (i) {
    return new Promise(function (resolve, reject) {
        connection.query('SELECT * FROM news WHERE id = ?',[i], function (error, results) {
            if (error) {
                reject(error);
            }
            resolve(results);
        });
    });
};

let getCategories = function () {
    return new Promise(function (resolve, reject) {
        connection.query('SELECT * FROM categories', function (error, results) {
            if (error) {
                reject(error);
            }
            console.log(results);
            resolve(results);
        });
    });
};

let getSimilarNews = function (idFeed) {
    console.log('HHHHHHHHHHHH');
    return new Promise(function (resolve, reject) {
        connection.query(' SELECT * FROM news where id = ?',[idFeed], function (error, results) {
            if (error) {
                reject(error);
            }
            console.log(results);
            resolve(results[0]);
        });
    })
    .then( r => {
        console.log(r);
        let tags = r.tags.split(';');
        let str_tags = [];
        tags.forEach(t=>{
            str_tags.push(`tags like '%${t}%'`);
        });
        // let q = "SELECT * FROM news WHERE " + str_tags.join(' OR ');
        let q = "SELECT * FROM news WHERE " + str_tags.join(' OR ') + ` AND id_cat = ${r.id_cat} `;
        console.log(q);
        return new Promise(function (resolve, reject) {
            connection.query(q, function (error, results) {
                if (error) {
                    reject(error);
                }
                console.log(results);
                results = results.filter(r=>r.id !== idFeed);
                resolve(results);
            });
        })
    })
};

let getNewsCategory = function (idcat) {
    return new Promise(function (resolve, reject) {
        connection.query('SELECT * FROM news WHERE id_cat = ? ORDER by vip DESC, views DESC',[idcat], function (error, results) {
            if (error) {
                reject(error);
            }
            let result = results.filter(r=> r.vip === 1);
            let listWithoutVIP = results.filter(r=> r.vip === 0);
            // let sorted = listWithoutVIP.sort(coolSort);
            let sorted = bubbleSortBasic(listWithoutVIP);
            console.log(sorted);
            sorted.forEach(r=>{
                result.push(r);
            });
            resolve(result);
        });
    });
};
let updateFeedView = function (i) {
    return new Promise(function (resolve, reject) {
        connection.query('UPDATE news SET news.views = news.views+1 WHERE id= ?',[i], function (error, results) {
            if (error) {
                reject(error);
            }
            resolve(results);
        });
    });
};
let updateNewsVIP = function (i) {
    return new Promise(function (resolve, reject) {
        connection.query('UPDATE news SET news.vip = 1 WHERE id= ?',[i], function (error, results) {
            if (error) {
                reject(error);
            }
            resolve(results);
        });
    });
};
let updateFeedRaring = function (val, i) {
    return new Promise(function (resolve, reject) {
        connection.query('UPDATE news SET news.rating = news.rating + ? WHERE id = ?',[val, i], function (error, results) {
            if (error) {
                reject(error);
            }
            resolve(results);
        });
    });
};

function bubbleSortBasic(array) {
    for(var i = 0; i < array.length; i++) {
        for(var j = 1; j < array.length; j++) {
            let a_rat = array[j].rating / (array[j].views+1) ;
            let b_rat = array[j-1].rating /( array[j-1].views+1) ;
            // if(a_rat < b_rat) {
            if(a_rat > b_rat) {
                swap(array, j - 1, j);
            }
        }
    }
    return array;
}
function swap(array, i, j) {
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}
function processUrl(feed) {
  return request.getAsync(feed.url).spread(function (res, body) {

    switch (feed.site){
      case 1: {
        return {category: feed.cat, site: feed.site, news: getNews_Korr(body).filter((e)=> e!== null)};
      }
      case 2: {
        return {category: feed.cat, site: feed.site, news: getNews_RBC(body).filter((e)=> e!== null)};
      }
    }
  });
}
function processNewsItem(feed) {
    // console.log('feed');
    // console.log(feed);

    return request.getAsync(feed.link).spread(function (res, body) {
      // console.log('body');
      // console.log(body);
        let parseRes;
        switch (feed.site){
            case 1: {

                parseRes = getBody_Korr(body);
              //TODO найти дату, полный текст, теги, затем изменить фид и вернуть его
              // return parseRes;
              break;
            }
            case 2: {
                // return {category: feed.cat, site: feed.site, news: getNews_RBC(body).filter((e)=> e!== null)};
                parseRes = getBody_RBC(body);
                // console.log('HERE');
                // return parseRes;
                break;
            }
        }
        //newsBody, newsDate, newsTags
        feed.newsBody = parseRes.newsBody;
        feed.newsDate = parseRes.newsDate;
        feed.newsTags = parseRes.newsTags;
        if(feed.site === 2 && parseRes.image !== null){
            feed.image = parseRes.image;
        }
        return feed;
    });
}
function getNews_Korr(html) {
    let doc = new JSDOM(html).window.document;
    return Array.from(doc.querySelectorAll('div.article_rubric_top')).map((item)=>{
        let img = item.children[0].children[0].innerHTML;//.innerHTML;
        img = img.substr(img.indexOf('=')+2).replace('">','');
        if (img.indexOf('http') < 0) {
            img = myImages[Math.floor(Math.random() * myImages.length)];
        }
        if (item.children[2]!== undefined) {
            let desc = item.children[2].innerHTML;
            desc = desc.substr(0, desc.indexOf('<d'));
            let tit = fixString(item.children[1].children[0].textContent);
            return {
                title: tit,
                link: item.children[1].children[0].getAttribute('href'),
                image: img,
                desc: fixString(desc),
                isGood: analTitle(tit),
                icon: 'http://ua.korrespondent.net/favicon.ico'
            };
        }
        return null;
    });
}
function getNews_RBC(html) {
    let doc = new JSDOM(html).window.document;
    return Array.from(doc.querySelectorAll('div.news-feed-item div.content-section')).map((item)=>{
        let a = item.children[0];
        let spans = a.getElementsByTagName('span');
        let i = spans.length;
        while (i--) {
            spans[i].parentNode.removeChild(spans[i]);
        }
        return {
            title: fixString(a.innerHTML),
            link: a.getAttribute('href'),
            image: myImages[Math.floor(Math.random() * myImages.length)],
            desc : fixString(a.innerHTML),
            isGood: analTitle(fixString(a.innerHTML)),
            icon : 'https://www.rbc.ua/static/daily/img/favicon/favicon.ico'
        };
    });
}
let gg = 0;
function getBody_Korr( html) {
  let doc = new JSDOM(html).window.document;
  let post = doc.querySelector('div.post-item__text');

  // if(doc.getElementById('insertNewsBlock') !== null)
  //   post.removeChild(doc.getElementById('insertNewsBlock'));
  let newsBody = post.innerHTML;
  // console.log(newsBody);

  let newsTags = Array.from(doc.querySelectorAll('div.post-item__tags-item a')).map(e=>e.innerHTML);
  // console.log(newsTags);

  let newsDate = doc.querySelector('div.post-item__info').innerHTML.split('&nbsp;')[1];
  // console.log(newsDate);

  return {newsBody, newsDate, newsTags};
}
function getBody_RBC( html) {
    let doc = new JSDOM(html).window.document;
    let newsBody = '';
    Array.from(doc.querySelectorAll('div.publication-text-area > div p')).forEach(e=>{
      "use strict";
        newsBody+=e.innerHTML;
    });

    // let newsTags = Array.from(doc.querySelectorAll('div.post-item__tags-item a')).map(e=>e.innerHTML);
    let newsTags = Array.from(doc.querySelectorAll('div.tags a')).map(e=>e.innerHTML);
    // console.log(newsTags);
    let newsDate = doc.querySelector('div.meta').innerHTML;
    newsDate = newsDate.substr(newsDate.lastIndexOf('&nbsp;') + 6).trim();
    // console.log(newsDate);

    let image = null;
        if(doc.querySelector('div.content-extended div.img-wrapper')!== null) {

            image = doc.querySelector('div.content-extended div.img-wrapper').children[0].getAttribute('src');
        }

    return {newsBody, newsDate, newsTags, image};
}
function analTitle(str) {
    str = str.toLowerCase();
    for(let i = 0; i < badWords.length; i++){
        if(str.includes(badWords[i])){
            return false;
        }
    }
    return true;
}
function fixString(str) {
    return str.replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim()
}

exports.fetchNewNews = fetchNewNews;
exports.getCategories = getCategories;
exports.getNewsCategory = getNewsCategory;
exports.getCategory = getCategory;
exports.getFeed = getFeed;
exports.updateFeedView = updateFeedView;
exports.updateFeedRaring = updateFeedRaring;
exports.getVIPNews = getVIPNews;
exports.getBestNews = getBestNews;
exports.getSimilarNews = getSimilarNews;
exports.updateNewsVIP = updateNewsVIP;
