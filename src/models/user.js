const mongoose = require('mongoose')
const schema = new mongoose.schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },

  first_name: { type: String, required: true },
  last_name: { type: String, required: false },

  about: String,
  tel: String,
  avatar: String,
  commercial: Boolean
})

const User = mongoose.model('User', schema)
module.exports = User
