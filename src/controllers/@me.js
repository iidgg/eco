const router = require('express').Router()
const upload = require('multer')({ dest: 'uploads/avatars/' })
const fsPromise = require('fs/promises')

const protected = require('../middleware/protected')
const User = require('../models/user')
const Order = require('../models/order')
const { updateSession } = require('../utils')

router.use(protected)

router.get('/', async (req, res) => {
  const user = await User.findById(req.session.user._id)
  res.render('@me/index.ejs', {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    tel: user.tel,
    about: user.about,
    avatar: user.avatar,
    commercial: user.commercial
  })
})

router.get('/orders', async (req, res) => {
  const user = await User.findById(req.session.user._id)
  res.render('@me/orders.ejs', {
    orders: await Order.find({ userId: req.session.user._id })
  })
})

router.put('/', upload.single('avatar'), async (req, res) => {
  const updated = req.body
  if (req.file) {
    updated.avatar = req.file.filename
    if (req.session.user.avatar)
      await fsPromise
        .unlink(`uploads/avatars/${req.session.user.avatar}`)
        .catch(() => null)
  }

  await User.findByIdAndUpdate(req.session.user._id, updated)
  await updateSession(req, { user: updated })
  res.redirect('/@me')
})

module.exports = router
