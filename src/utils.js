const Category = require('./models/category')

const updateSession = async (req, data) => {
  const { user } = data
  const session = req.session

  if (user) {
    if (!req.session.user) {
      req.session.user = {}
    }

    req.session.user = {
      _id: user._id || session.user._id,
      avatar: user.avatar || session.user.avatar,
      username: user.username || session.user.username,
      firstName: user.firstName || session.user.firstName
    }
  }

  await req.session.save()
}

const addCategories = async () => {
  const categories = require('../assets/categories.json').categories

  console.log('Adding Categories to database')
  console.time('Added Categories to database')

  const saved = new Set((await Category.find()).map((c) => c.name))
  const newOnes = categories
    .filter((category) => !saved.has(category))
    .map((category) => ({ name: category }))

  if (newOnes.length > 0) await Category.create(newOnes)
  else console.log(`Skipping categories [${saved.size}/${categories.length}]`)

  console.timeEnd('Added Categories to database')
}

module.exports = { updateSession, addCategories }
