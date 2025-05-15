const router = require('express').Router()
const protected = require('../middleware/protected')
const User = require('../models/user')

router.use(protected)

router.get('/', async (req, res) => {
  const user = await User.findById(req.session.user._id)
  res.render('@me.ejs', {
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    email: user.email,
    tel: user.tel,
    about: user.about,
    commercial: user.commercial
  })
})

router.put('/', async (req, res) => {
  await User.findByIdAndUpdate(req.session.user._id, req.body)
  res.redirect('/@me')
})

module.exports = router
