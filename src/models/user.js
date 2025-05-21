const mongoose = require('mongoose')
const schema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },

    firstName: { type: String, required: true },
    lastName: { type: String, required: false },

    about: String,
    tel: String,
    avatar: String,
    commercial: Boolean
  },
  { timestamps: true }
)

const User = mongoose.model('User', schema)
module.exports = User
