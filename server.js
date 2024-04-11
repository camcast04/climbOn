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

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/climb-on', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//climbspot index
app.get('/climbspots', async (req, res) => {
  // find all the climbspots (grab them)
  const climbspots = await climbspots.find({});
  // passing it through to template and render them
  res.render('climbspots/index', { climbspots });
});

// form to create new climbspots
app.get('/climbspots/new', (req, res) => {
  res.render('climbspots/new'); // rendering a form
});

//payload from form (req.body)
app.post('/climbspots', async (req, res) => {
  //creating a new climbspot
  const climbspot = new Climbspot(req.body.climbspot);
  //saving
  await climbspot.save();
  res.redirect(`/climbspots/${climbspot._id}`);
});

// showing climbspot
app.get('/climbspots/:id', async (req, res) => {
  //finding the climbspot by id
  const climbspot = await Climbspot.findById(req.params.id);
  res.render('climbspots/show', { climbspot });
});

//route that serves the form
// we need to look up the thing we are editing so we can pre-populate the form
app.get('/climbspots/:id/edit', async (req, res) => {
  // we need to look up a climbspot by that id
  const climbspot = await Climbspot.findById(req.params.id);
  // and then pass it to climbspots/edit
  res.render('climbspots/edit', { climbspot });
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
