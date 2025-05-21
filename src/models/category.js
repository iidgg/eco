const mongoose = require('mongoose')
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true }
  },
  { timestamps: true }
)

const Category = mongoose.model('Category', schema)
module.exports = Category
