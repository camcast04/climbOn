const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res, next) => {
  res.redirect('/climbspots');
});

// Google OAuth login route
router.get(
  '/auth/google',
  passport.authenticate(
    // passport strategy
    'google',
    {
      // Requesting user's profile and email
      scope: ['profile', 'email'],
      // Optionally force pick account every time
      prompt: 'select_account', // everytime it will prompt you for two accounts if you have more than one (optional)
    }
  )
);

// Google OAuth callback route
router.get(
  '/oauth2callback',
  passport.authenticate('google', {
    successRedirect: '/climbspots',
    failureRedirect: '/', // landing page
  })
);

// OAuth logout route
router.get('/logout', function (req, res) {
  req.logout(function () {
    res.redirect('/');
  });
});

module.exports = router;
