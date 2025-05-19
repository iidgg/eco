const express = require('express')
const router = express.Router()
const protected = require('../middleware/protected')
const Review = require('../models/review')
router.use(protected)

router.post('/:productId', async (req, res) => {
  req.body.userId = req.session.user._id
  req.body.productId = req.params.productId
  await Review.create(req.body)
  res.redirect(`/products/${req.params.productId}`)
})
module.exports = router
