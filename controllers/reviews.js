const Climbspot = require('../models/climbspot');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
  const climbspot = await Climbspot.findById(req.params.id);
  const review = new Review(req.body.review);
  climbspot.reviews.push(review);
  await review.save();
  await climbspot.save();
  res.redirect(`/climbspots/${climbspot._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Climbspot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/climbspots/${id}`);
};
