const express = require('express')
const routes = require('./router')
const app = module.exports = express()

app.use(express.json())
app.use('/items', routes)




