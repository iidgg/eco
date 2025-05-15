const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

router.get('/signup', (req, res) => {
  res.render('auth/signup.ejs')
})

router.post('/signup', async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username })
  if (userInDatabase) {
    return res.send('<h1>Username already taken</h1>')
  }

  if (req.body.confirmPassword !== req.body.password) {
    return res.send('<h1>Enter matching password and confirm password</h1>')
  }
  req.body.commercial = req.body.commercial === 'on'
  const hashedPassword = bcrypt.hashSync(req.body.password, 10)
  req.body.password = hashedPassword
  const user = await User.create(req.body)
  res.redirect('/')
})

module.exports = router
