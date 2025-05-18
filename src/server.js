require('dotenv').config()
if (!process.env.SESSION_SECRET) {
  console.error('MUST Provide a SESSION_SECRET environment')
  process.exit(1)
}

const mongoose = require('mongoose')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')

const app = express()

app.use('/static/avt', express.static('uploads/avt/'))

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
})

app.use(require('morgan')('dev'))

// Controllers
app.use('/auth', require('./controllers/auth.js'))
app.use('/@me', require('./controllers/@me.js'))
app.use('/products', require('./controllers/products.js'))

app.get('/', (req, res) => {
  res.render('home.ejs')
})

app.listen(process.env.PORT, (err) => {
  if (err) throw err
  console.log(`Listening on port ${process.env.PORT}`)
})
