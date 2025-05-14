const express = require('express')
const app = express()

require('dotenv').config()

app.use(require('morgan')('dev'))

app.listen(process.env.PORT, (err) => {
  if (err) throw err
  console.log(`Listening on port ${process.env.PORT}`)
})
