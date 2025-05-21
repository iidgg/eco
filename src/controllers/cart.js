const router = require('express').Router()
const protected = require('../middleware/protected')
const Cart = require('../models/cart')
const Order = require('../models/order')
const Product = require('../models/product')

router.use(protected)
router.use(async (req, res, next) => {
  req.cart =
    (await Cart.findOne({ userId: req.session.user._id })) ||
    (await Cart.create({ userId: req.session.user._id, items: [] }))
  res.locals.cart = req.cart
  next()
})

router.get('/', async (req, res) => {
  res.locals.items = {}
  await Promise.all(
    req.cart.items.map(async (item) => {
      const product = await Product.findById(item.itemId)
      if (product) res.locals.items[product._id] = product
    })
  )

  res.locals.total = res.locals.cart.items
    .map((item) => {
      const currentPrice = res.locals.items[item.itemId].price
      return item.quantity * currentPrice
    })
    .reduce((acc, v) => acc + v, 0)

  res.render('cart/index.ejs')
})

router.post('/checkout', async (req, res) => {
  await Order.create({
    userId: req.session.user._id,
    items: req.cart.items
  })

  for (const item of req.cart.items) {
    await Product.findByIdAndUpdate(item.itemId) // TODO
  }

  await req.cart.deleteOne()
  res.redirect('/@me/orders')
})

router.use(async (req, res, next) => {
  if (!req.query.pid) {
    return res.status(400).send("Product id query is required as'pid'")
  }

  req.product = await Product.findById(req.query.pid)
  if (!req.product) {
    return res.status(404).send('Product not found')
  }

  next()
})

router.put('/', async (req, res) => {
  const cartItem = req.cart.items.find(
    (i) => i.itemId.toString() === req.product._id.toString()
  )

  const quantity = (cartItem?.quantity || 0) + 1
  if (req.product.quantity >= 0 && quantity > req.product.quantity) {
    return res.status(400).send("Product doesn't have enough quantity")
  }

  const newItem = {
    itemId: req.product._id,
    quantity
  }

  if (cartItem) req.cart.items[req.cart.items.indexOf(cartItem)] = newItem
  else req.cart.items.push(newItem)

  await req.cart.save()
  res.redirect(`/products/${req.product._id}`)
})

router.delete('/', async (req, res) => {
  const itemIndex = req.cart.items.indexOf(req.product._id)
  req.cart.items.splice(itemIndex, 1)
  await req.cart.save()
  res.redirect('/cart')
})

module.exports = router
