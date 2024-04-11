const express = require('express');
const router = express.Router({ mergeParams: true });
const Climbspot = require('../models/climbspot');
const Review = require('../models/review');

router.post('/climbspots/:id/reviews', async (req, res) => {
  const climbspot = await Climbspot.findById(req.params.id);
  const review = new Review(req.body.review);
  climbspot.reviews.push(review);
  await review.save();
  await climbspot.save();
  res.redirect(`/climbspots/${climbspot._id}`);
});

//delete reviews
//$pull operator removes from an existing array all instances of a value or values that match a specified condition
router.delete('/:reviewId', async (req, res) => {
  const { id, reviewId } = req.params;
  await Climbspot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/climbspots/${id}`);
});

module.exports = router;
