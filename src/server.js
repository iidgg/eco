require('dotenv').config()
if (!process.env.SESSION_SECRET) {
  console.error('MUST Provide a SESSION_SECRET environment')
  process.exit(1)
}

const mongoose = require('mongoose')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const ejsLayouts = require('express-ejs-layouts')
const { addCategories } = require('./utils.js')

const app = express()

app.set('view engine', 'ejs')
app.use(ejsLayouts)

app.use('/static/avatars', express.static('uploads/avatars/'))
app.use('/static/products', express.static('uploads/products/'))
app.use('/assets', express.static('assets'))

app.use(require('method-override')('_method'))
app.use(express.urlencoded({ extended: false }))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
  })
)

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)

  addCategories()
})

app.use(require('morgan')('dev'))

app.use((req, res, next) => {
  res.locals.user = req.session.user ?? null
  next()
})

// Models
const Product = require('./models/product.js')
const Review = require('./models/review.js')

// Controllers
app.use('/auth', require('./controllers/auth.js'))
app.use('/@me', require('./controllers/@me.js'))
app.use('/products', require('./controllers/products.js'))
app.use('/reviews', require('./controllers/reviews.js'))
app.use('/cart', require('./controllers/cart.js'))
app.get('/', async (req, res) => {
  res.locals.title = 'Home'
  res.render('home.ejs', {
    products: await Product.aggregate().sample(6),
    reviews: await Review.aggregate().match({ rating: 10 }).sample(5),
    bestProduct: (await Product.aggregate().sample(1))[0]
  })
})

app.listen(process.env.PORT, (err) => {
  if (err) throw err
  console.log(`Listening on port ${process.env.PORT}`)
})
