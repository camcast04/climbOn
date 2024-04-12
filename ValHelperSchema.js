const Joi = require('joi');
const { number } = require('joi');

module.exports.climbspotSchema = Joi.object({
  climbspot: Joi.object({
    title: Joi.string().required(),
    difficulty: Joi.number().required().min(0),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});