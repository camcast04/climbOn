//server.js
// Conditionally load environment variables from .env if not in production
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
// Load all necessary modules from npm and node
const express = require('express');
const path = require('path');
const engine = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./helpers/ExpressErrors');
const methodOverride = require('method-override');
const logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const cookieParser = require('cookie-parser');
const User = require('./models/user');

const app = express();

// Import routers from other parts of the app
const indexRouter = require('./routes/index');
const userRouters = require('./routes/users');
const climbspotRouters = require('./routes/climbspots');
const reviewRouters = require('./routes/reviews');

// Load environment variables from .env file
require('dotenv').config();

// Connect to MongoDB database
require('./config/database');

// Configure passport for handling user authentication
require('./config/passport');

// Initialize express app

// Setup EJS as the view engine with 'ejs-mate' for layouts support
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Middleware to parse request bodies and cookies, handle static files, and log requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies (form submissions)
app.use(cookieParser()); // Parses cookies attached to the client request object
app.use(express.static(path.join(__dirname, 'public'))); // Serves static files like images, CSS, and JavaScript
app.use(logger('dev')); // Logs requests to the console for debugging
app.use(methodOverride('_method')); // Allows forms to simulate PUT and DELETE methods
app.use((req, res, next) => {
  console.log('Method:', req.method, 'Path:', req.originalUrl);
  next();
});
// Configure session management with express-session
const sessionConfig = {
  secret: process.env.SECRET, // Secret used to sign the session ID cookie (keep this secure!)
  resave: false, // Don't resave session if it hasn't been modified
  saveUninitialized: false, // Don't save an uninitialized session
  cookie: {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Cookie expires in 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7, // Same as above, setting max age
  },
};
app.use(session(sessionConfig));
app.use(flash());
// Initialize passport and session for persistent login sessions
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// Middleware to make the user object available for all views
app.use(function (req, res, next) {
  res.locals.user = req.user || null; // If user is authenticated, make it available in all views
  next(); // Move to next middleware
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Route handling for different parts of the site

app.use('/', indexRouter); // Handles root and Google OAuth routes
app.use('/', userRouters); // Handles routes related to user actions
app.use('/climbspots', climbspotRouters); // Handles routes for climbing spots
app.use('/climbspots/:id/reviews', reviewRouters); // Handles routes for reviews of climbing spots

app.get('/', (req, res) => {
  res.render('home');
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

// General error handler
app.use(function (err, req, res, next) {
  const { statusCode = 500 } = err;
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // Only provide error details in development
  if (!err.message) err.message = 'Something is not right!';
  res.status(err.status || 500);
  // Render a custom error page
  res.status(statusCode).render('error', { err });
});

// Export the app to be used elsewhere in our application
module.exports = app;
