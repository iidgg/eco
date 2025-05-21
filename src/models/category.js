const { getElasticSearchClient } = require('../helpers/elastic')
const mongoose = require('mongoose')
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true }
  },
  { timestamps: true }
)

const elasticSearch = getElasticSearchClient()
const indexCategory = async (category) => {
  await elasticSearch.index({
    index: 'categories',
    id: category._id.toString(),
    document: {
      name: category.name
    }
  })
}

schema.post('save', function () {
  indexCategory(this)
})

schema.post('updateMany', function () {
  indexCategory(this)
})

schema.post('findOneAndUpdate', function () {
  indexCategory(this)
})

schema.post('updateOne', function () {
  indexCategory(this)
})

Object.defineProperty(schema, 'setupElasticSearchHook', {
  value: function (elasticClient) {
    const index = 'categories'
    schema.post('save', async function () {
      await elasticClient.index({
        index,
        id: this._id.toString(),
        document: {
          name: this.name
        }
      })
    })

    schema.post('remove', async function () {
      await elasticClient.delete({
        index,
        id: this._id.toString()
      })
    })
  },
  writeable: false,
  enumerable: false,
  configurable: false
})

const Category = mongoose.model('Category', schema)
module.exports = Category
