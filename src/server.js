const mongoose = require('mongoose')
const express = require('express')
const app = express()

require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

app.use(require('morgan')('dev'))

app.listen(process.env.PORT, (err) => {
  if (err) throw err
  console.log(`Listening on port ${process.env.PORT}`)
})
