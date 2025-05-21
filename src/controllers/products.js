const fs = require('fs')
const fsPromise = require('fs/promises')
const multer = require('multer')
const express = require('express')
const router = express.Router()
const protected = require('../middleware/protected')
const Product = require('../models/product')
const User = require('../models/user')
const Review = require('../models/review')

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const path = `uploads/products/${req.params.productId}/`
      fs.mkdir(path, { recursive: true }, (err) => cb(err, path))
    }
  })
})

router.get('/', async (req, res) => {
  const allProducts = await Product.find()
  res.render('products/index.ejs', { products: allProducts })
})

router.get('/new', protected, (req, res) => {
  res.render('products/new.ejs')
})

router.get('/:productId', async (req, res) => {
  res.render('products/show.ejs', {
    product: await Product.findById(req.params.productId),
    user: req.session.user ? await User.findById(req.session.user._id) : null,
    reviews: await Review.find({ productId: req.params.productId })
  })
})

router.use(protected)
const ownsProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.productId)
  if (!product) return res.status(404).send()
  if (product.userId.toString() !== req.session.user._id)
    return res.status(401).send()
  req.product = product
  next()
}

router.post('/new', async (req, res) => {
  req.body.userId = req.session.user._id
  await Product.create(req.body)
  res.redirect('/')
})

router.get('/:productId/edit', ownsProduct, async (req, res) => {
  res.render('products/edit.ejs', { product: req.product })
})

router.put(
  '/:productId',
  ownsProduct,
  upload.array('pictures', 10),
  async (req, res) => {
    req.product.pictures.push(...req.files.map((f) => f.filename))
    req.body.pictures = req.product.pictures
    await req.product.updateOne(req.body)
    res.redirect(`/products/${req.params.productId}/edit`)
  }
)

router.delete('/:productId', ownsProduct, async (req, res) => {
  await req.product.deleteOne()
  await Review.deleteMany({ productId: req.params.productId })
  res.redirect('/products')
})

router.delete('/:productId/:pictureId', ownsProduct, async (req, res) => {
  const pictureIndex = req.product.pictures.indexOf(req.params.pictureId)
  req.product.pictures.splice(pictureIndex, 1)
  await req.product.save()
  res.redirect(`/products/${req.params.productId}/edit`)
})

module.exports = router
