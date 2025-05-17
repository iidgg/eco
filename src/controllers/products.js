const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const protected = require('../middleware/protected')
const Product = require('../models/product')
const User = require('../models/user')
const Category = require('../models/category')
const session = require('express-session')

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
  if (req.session.user) {
    const foundUser = await User.findById(req.session.user._id)
    res.render('products/show.ejs', { product: foundProduct, user: foundUser })
  } else {
    res.render('products/show.ejs', { product: foundProduct, user: null })
  }
})

router.get('/:productId/edit', async (req, res) => {
  const foundProduct = await Product.findById(req.params.productId)
  res.render('products/edit.ejs', { product: foundProduct })
})

router.put('/:productId', async (req, res) => {
  await Product.findByIdAndUpdate(req.params.productId, req.body)
  res.redirect(`/products/${req.params.productId}`)
})

module.exports = router
