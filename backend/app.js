var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
const pool = require('./DBConfig');
const MySQLStore = require('express-mysql-session')(session);
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'client', 'build')));
// Configuration options for the session store
const sessionStoreOptions = {
  expiration: 86400000, // Session expiration time (in milliseconds), e.g., 24 hours
  createDatabaseTable: false, // Do not create the sessions table as it already exists
};
// Create the session store
const sessionStore = new MySQLStore(sessionStoreOptions, pool);
module.exports.sessionStore = sessionStore;
app.use(session({
  secret: '187380bd17dc54b817c1989e0543665d17a9ccb5',
  store: sessionStore,
  resave: false,
  saveUninitialized: true
}));

app.use('/home', indexRouter);
app.use('/users', usersRouter);

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
