const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');

// method to plug - in an instance of the OAyth strategy and provide a verify callback function
//that will be called whenever a user has logged in using OAuth
passport.use(
  new GoogleStrategy(
    // Configuration object
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
    // The verify callback function
    // Let's use async/await!
    async function (accessToken, refreshToken, profile, cb) {
      // When using async/await  we use a
      // try/catch block to handle an error
      try {
        // A user has logged in with OAuth...(google id us the user id)
        let user = await User.findOne({ googleId: profile.id }); // might have to reassign
        // Existing user found, so provide it to passport
        if (user) return cb(null, user);
        // We have a new user via OAuth!
        user = await User.create({
          name: profile.displayName,
          googleId: profile.id,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });
        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);
// provide callback passport will call after verify call back
passport.serializeUser(function (user, cb) {
  cb(null, user._id);
});
// provide callback that passport will call for every request when a user is logged in
passport.deserializeUser(async function (userId, cb) {
  // It's nice to be able to use await in-line!
  cb(null, await User.findById(userId));
});
