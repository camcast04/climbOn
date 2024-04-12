const Joi = require('joi'); // Import Joi module for data validation
const { number } = require('joi');

// Define a schema for validating 'climbspot' data structures
module.exports.climbspotSchema = Joi.object({
  climbspot: Joi.object({
    title: Joi.string().required(),
    difficulty: Joi.number().required().min(0),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

// Define a schema for validating 'review' data structures
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
