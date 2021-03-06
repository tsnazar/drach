var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var helmet = require('helmet');

var indexRouter = require('./routes/index');

var app = express();

app.use(helmet({
  contentSecurityPolicy:{
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': ["'self'", "https://code.jquery.com/", "https://www.youtube.com/"],
      'frame-src': ["'self'", "https://www.youtube.com/"]
    }
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
  extname: '.hbs',
  helpers: require('./config/handlebars-helpers.js')
}));
app.set('view engine', 'hbs');

if (app.get('env') == 'development') {
  var sassMiddleware = require('node-sass-middleware');
  app.use(logger('dev'));
  app.use(express.json({limit: '50mb'}));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
  }));
} else {
  app.use(logger('combined'));
  app.use(express.json());
  app.use(express.urlencoded());
}
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const db = require("./models");
db.sequelize.sync().then(() => {
  console.log("Sync db.");
});

app.use('/', indexRouter);

app.get('*', function(req, res){
  res.send('Not Found', 404);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
