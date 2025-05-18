const express = require('express')
const router = express.Router()
const protected = require('../middleware/protected')
const Review = require('../models/review')
router.use(protected)


module.exports = router
