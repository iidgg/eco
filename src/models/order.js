const mongoose = require('mongoose')
const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: [0, 'Cannot buy less than 0']
        }
      }
    ]
  },
  { timestamps: true }
)

const Order = mongoose.model('Order', schema)
module.exports = Order
