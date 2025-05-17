const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const protected = require('../middleware/protected')
const Product = require('../models/product')
const Category = require('../models/category')
const session = require('express-session')

router.get('/', async (req, res) => {
  const allProducts = await Product.find()
  res.render('products/index.ejs', { products: allProducts })
})

router.use(protected)
router.get('/new', (req, res) => {
  res.render('products/new.ejs')
})

router.post('/new', async (req, res) => {
  req.body.userId = req.session.user._id
  await Product.create(req.body)
  res.redirect('/')
})

module.exports = router
