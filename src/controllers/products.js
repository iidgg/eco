const express = require('express')
const router = express.Router()
const protected = require('../middleware/protected')
const Product = require('../models/product')
const User = require('../models/user')
const Review = require('../models/review')

router.get('/', async (req, res) => {
  const allProducts = await Product.find()
  res.render('products/index.ejs', { products: allProducts })
})

router.get('/new', protected, (req, res) => {
  res.render('products/new.ejs')
})

router.post('/new', protected, async (req, res) => {
  req.body.userId = req.session.user._id
  await Product.create(req.body)
  res.redirect('/')
})

router.get('/:productId', async (req, res) => {
  const foundProduct = await Product.findById(req.params.productId)
  const foundReviews = await Review.find({product_id: req.params.productId})
  if (req.session.user) {
    const foundUser = await User.findById(req.session.user._id)
    res.render('products/show.ejs', { product: foundProduct, user: foundUser, reviews: foundReviews })
  } else {
    res.render('products/show.ejs', { product: foundProduct, user: null, reviews: foundReviews })
  }
})

router.get('/:productId/edit', protected, async (req, res) => {
  const foundProduct = await Product.findById(req.params.productId)
  if (foundProduct.userId.toString() === req.session.user._id) {
    res.render('products/edit.ejs', { product: foundProduct })
  } else {
    res.redirect('/products')
  }
})

router.put('/:productId', protected, async (req, res) => {
  const foundProduct = await Product.findById(req.params.productId)
  if (foundProduct.userId.toString() === req.session.user._id) {
  await foundProduct.updateOne(req.body)
  res.redirect(`/products/${req.params.productId}`)
  } else {
    res.redirect('/products')
  }
})

router.delete('/:productId', protected, async (req, res) => {
  await Product.findByIdAndDelete(req.params.productId)
  await Review.deleteMany({product_id: req.params.productId})
  res.redirect('/products')
})


module.exports = router
