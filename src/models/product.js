const { getElasticSearchClient } = require('../helpers/elastic')
const mongoose = require('mongoose')
const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    shortDesc: { type: String, required: true },
    desc: String,

    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    pictures: [String],

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      }
    ]
  },
  { timestamps: true }
)

const elasticSearch = getElasticSearchClient()
const indexProduct = async (product) => {
  await elasticSearch.index({
    index: 'products',
    id: product._id.toString(),
    document: {
      title: product.title,
      shortDesc: product.shortDesc,
      desc: product.desc
    }
  })
}

schema.post('save', function () {
  indexProduct(this)
})

schema.post('updateMany', function () {
  indexProduct(this)
})

schema.post('findOneAndUpdate', function () {
  indexProduct(this)
})

schema.post('updateOne', function () {
  indexProduct(this)
})

const Product = mongoose.model('Product', schema)
module.exports = Product
