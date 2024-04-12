//models/user.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema(
  {
    name: String,
    googleId: { type: String, index: true, unique: false, sparse: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: String,
  },
  {
    timestamps: true,
  }
);

// const userSchema = new Schema(
//   {
//     name: String,
//     googleId: {
//       type: String,
//       required: true,
//     },
//     email: String,
//     avatar: String,
//   },
//   {
//     timestamps: true,
//   }
// );

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);
