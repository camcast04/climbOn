const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const passport = require('passport');

const userSchema = new Schema(
  {
    name: String,
  },
  {
    timestamps: true,
  }
);

// userSchema.plugin(passport());

module.exports = mongoose.model('User', userSchema);
