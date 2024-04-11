const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const passport = require('passport');

const userSchema = new Schema(
  {
    name: String,
    googleId: {
      type: String,
      required: true,
    },
    email: String,
    avatar: String,
  },
  {
    timestamps: true,
  }
);

// userSchema.plugin(passport());

module.exports = mongoose.model('User', userSchema);
