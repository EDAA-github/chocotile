let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let hbs = require('express-handlebars');
// let expressValidator = require('express-validator');
let expressSession = require('express-session');
let request = require('request');

let index = require('./routes/index');
let register = require('./routes/register');
let login = require('./routes/login');
let logout = require('./routes/logout');
let category = require('./routes/category');
let feed = require('./routes/feed');

// let admin = require('./routes/admin');
let cron = require('node-cron');
let news = require('./models/News');
let app = express();

// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({secret: 'g45fdg456fg4d5g4fd465xz1c2dr', saveUninitialized: false, resave: false, expires: false, cookie: { httpOnly: false,  secure: false}}));

app.use('/', index);
app.use('/category', category);
app.use('/feed', feed);
app.use('/register', register);
app.use('/login', login);
app.use('/logout', logout);
// app.use('/profile', profile);
// app.use('/admin', admin);

// // каждый 1 min проверяем на наличие новых новостей
// cron.schedule('0 */3 * * * *', function(){
//     news.fetchNewNews();
// });
//
// каждый 1 min проверяем на наличие новых новостей
// cron.schedule('0 */3 * * * *', function(){
  //   news.fetchNewNews();
// });


// every 8 min self-request, HEROKU server must live!
  cron.schedule('0 */8 * * * *', function(){
      request("https://chocotile.herokuapp.com", function (err, req_res, body) {
          if (err) {
              console.error(err);
              return;    }
          console.log('~Callback');
      });
  });
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
