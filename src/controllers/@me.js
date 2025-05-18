const router = require('express').Router()
const upload = require('multer')({ dest: 'uploads/avatars/' })

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
    avatar: user.avatar,
    commercial: user.commercial
  })
})

router.put('/', upload.single('avatar'), async (req, res) => {
  req.body.avatar = req.file.filename
  await User.findByIdAndUpdate(req.session.user._id, req.body)
  res.redirect('/@me')
})

module.exports = router
