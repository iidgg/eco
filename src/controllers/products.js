const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const protected = require('../middleware/protected')
const Product = require('../models/product')
const Category = require('../models/category')

module.exports = router
