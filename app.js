require('dotenv').config()
const express = require('express')
const app = express()
const dal = require('./dal.js')
const HTTPError = require('node-http-error')
const bodyParser = require('body-parser')
const checkRequiredFields = require('./lib/check-required-fields')
const port = process.env.PORT || 5000
const { pathOr, keys } = require('ramda')

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send('Welcome to the Tagged API. Here you can manage all the tags.')
})

app.use(function(err, req, res, next) {
  console.log(req.method, req.path, err)
  res.status(err.status || 500)
  res.send(err)
})

app.listen(port, () => console.log('API is running on this port: ', port))
