const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const Climbspot = require('./models/climbspot');
const climbspot = require('./models/climbspot');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const engine = require('ejs-mate');

// requiring routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const climbspots = require('./routes/climbspots');
const reviews = require('./routes/reviews');

const app = express();
const methodOverride = require('method-override');

//middleware
// to be able to do put/patch delete requests
//npm i method-override
mongoose.connect('mongodb://localhost:27017/climb-on', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware
app.use(methodOverride('_method'));
const sessionConfig = {
  secret: 'thissecretsucks',
  resave: false,
  saveUninitialized: true,
  // this way dont stay signed forever their log in expires in one week
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use routers
app.use('/climbspots', climbspots);
app.use('/climbspots/:id/reviews', reviews);
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//*********************
//*********************
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
