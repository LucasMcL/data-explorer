'use strict'

// Require packages
const express = require('express')
const dotenv = require('dotenv')

// Config
dotenv.config()
const PORT = process.env.PORT || 8000

// Init app
const app = express()

app.listen(PORT, function() {
	console.log(`back end application listening on port ${PORT}`)
})

