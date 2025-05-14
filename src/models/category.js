const mongoose = require('mongoose')
const schema = new mongoose.schema({
  name: { type: String, required: true }
})

const Category = mongoose.model('Category', schema)
module.exports = Category
