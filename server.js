const express = require('express');
const createError = require('http-errors');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const session = require('express-session');
const methodOverride = require('method-override');
const logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const cookieParser = require('cookie-parser');

require('dotenv').config();
// cloud storage/ connect to MongoDB database:
require('./config/database');
//configure passport middleware
require('./config/passport');

// requiring routes
const usersRouter = require('./routes/users');
const climbspots = require('./routes/climbspots');
const reviews = require('./routes/reviews');

// load the secrets in the .env file

//middleware
// to be able to do put/patch delete requests
//npm i method-override
// mongoose.connect('mongodb://localhost:27017/climb-on', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

// view engine setup
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//parse the form info
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cookieParser());

// middleware
const sessionConfig = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  // this way dont stay signed forever their log in expires in one week
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// use routers (handlers)
app.use('/climbspots', climbspots);
app.use('/climbspots/:id/reviews', reviews);
// app.use('/', indexRouter);
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
