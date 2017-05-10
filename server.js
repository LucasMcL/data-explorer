'use strict'

// Require packages
const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

// Require routes, gathered in index.js file
const routes = require('./routes/')

// Init app
const app = express()

// Config
dotenv.config()
let PORT = process.env.PORT || 8000
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


// API routes
app.use('/api/', routes)

app.use((err,req,res,next) => {
  console.log("error", err)
  res.status(err.status || 500)
  res.json({
    message: err.message,
    error: {}
  })
})

if(process.env.NODE_ENV === 'test') PORT = 9001
app.listen(PORT, function() {
	console.log(`back end application listening on port ${PORT}`)
})

module.exports = app









