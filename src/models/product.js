const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: String,
  shortDesc: { type: String, required: true },

  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  pictures: [String],

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
})

const Product = mongoose.model('Product', schema)
module.exports = Product
