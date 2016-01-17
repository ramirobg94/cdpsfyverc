var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var session = require('express-session');
var methodOverride = require('method-override');
var flash = require('connect-flash');

//Mndb Para MongoDB
var mongoose = require('mongoose');
//Local
//mongoose.connect('mongodb://localhost:27017/CDPSfyPrueba');
//Despliegue
mongoose.connect('mongodb://10.1.3.24:27017/CDPSfyPrueba');
//Mndb 

var passport = require('passport');



var app = express();

app.use(session({ secret: 'holaestaesnuestrapasswordsecreta' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var routes = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('CDPSfy'));
app.use(session());
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next) {
  if(!req.session.redir) {
        req.session.redir = '/';
    }

  if(!req.path.match(/\/login|\/logout/)){
    console.log("path:"+ req.path);
    req.session.redir = req.path;
  }

  res.locals.session = req.session;
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
