const mongoose = require('mongoose')
const schema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    title: { type: String, required: true },
    review: { type: String, required: true },

    rating: {
      type: Number,
      required: true,
      min: [0, 'Review rating cannot be negative'],
      max: [10, 'Review rating cannot pass 10']
    }
  },
  { timestamps: true }
)

const Review = mongoose.model('Review', schema)
module.exports = Review
