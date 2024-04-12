const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const Climbspot = require('../models/climbspot');

router.post('/', reviews.createReview);

//delete reviews
//$pull operator removes from an existing array all instances of a value or values that match a specified condition
router.delete('/:reviewId', reviews.deleteReview);

module.exports = router;
