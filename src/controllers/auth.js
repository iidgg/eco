const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const validator = require('validator')
const User = require('../models/user')
const { updateSession } = require('../utils')

router.get('/signup', (req, res) => {
  res.locals.title = 'Sign Up'
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
  res.locals.title = 'Sign In'
  if (req.session.user) return res.redirect('/@me')
  res.render('auth/signin.ejs')
})

router.post('/signin', async (req, res) => {
  if (req.session.user) res.session.destroy()
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

  await updateSession(req, { user: userInDatabase })

  if (req.query.r) {
    return res.redirect(decodeURIComponent(req.query.r))
  }

  res.redirect('/')
})

router.get('/signout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

module.exports = router
