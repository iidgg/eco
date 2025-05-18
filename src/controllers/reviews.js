const express = require('express')
const router = express.Router()
const protected = require('../middleware/protected')
const Review = require('../models/review')
router.use(protected)

router.post('/:productId', async (req, res) => {
  req.body.user_id = req.session.user._id
  req.body.product_id = req.params.productId
  await Review.create(req.body)
  res.redirect(`/products/${req.params.productId}`)
})
module.exports = router
