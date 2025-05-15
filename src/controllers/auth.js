const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const validator = require('validator')
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

router.get('/signin', (req, res) => {
  res.render('auth/signin.ejs')
})

router.post('/signin', async (req, res) => {
  let userInDatabase
  if (validator.isEmail(req.body.usernameOrEmail)) {
    userInDatabase = await User.findOne({ email: req.body.usernameOrEmail })
  } else {
    userInDatabase = await User.findOne({ username: req.body.usernameOrEmail })
  }
  if (!userInDatabase) {
    return res.send('<h1>Wrong user information</h1>')
  }
  if (!bcrypt.compareSync(req.body.password, userInDatabase.password)) {
    return res.send('<h1>Wrong user information</h1>')
  }

  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
  }

  if (req.query.r) {
    return res.redirect(decodeURIComponent(req.query.r))
  }

  res.redirect('/')
})

module.exports = router
