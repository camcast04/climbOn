//routes/reviews.js

const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require('../config/middleware/middleware');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const Climbspot = require('../models/climbspot');
const wrapAsync = require('../helpers/wrapAsync');

router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.createReview));

//delete reviews
//$pull operator removes from an existing array all instances of a value or values that match a specified condition
router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviews.deleteReview)
);

module.exports = router;
