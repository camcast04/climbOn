const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passport = require('passport');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

UserSchema.plugin(passport);

module.exports = mongoose.model('User', UserSchema);
