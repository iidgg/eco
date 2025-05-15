const mongoose = require('mongoose')
const express = require('express')
const app = express()

require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

app.use(require('morgan')('dev'))

// Controllers
const authCtrl = require('./controllers/auth.js')

app.use('/auth', authCtrl)

app.get('/', (req, res) => {
  res.send('<h1>eco</h1>')
})

app.listen(process.env.PORT, (err) => {
  if (err) throw err
  console.log(`Listening on port ${process.env.PORT}`)
})
