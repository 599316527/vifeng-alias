let MongoClient = require('mongodb').MongoClient

let path = require('path')
let express = require('express')
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')

let getMongodbConnectionUrl = require('../../lib/UrlBuilder').getMongodbConnectionUrl
let { mongo: mongoConf, webapp: webappConf } = require('../../config')

let webAppBaseUrl = webappConf.baseUrl

let app = express()
app.use(bodyParser.json())
app.use(cookieParser())

app.use(path.join(webAppBaseUrl, '/api'), require('./routes/api'))
app.use(path.join(webAppBaseUrl, '/'), require('./routes/page'))

app.use(function (req, res, next) {
    let err = new Error()
    err.status = 404
    next(err)
})

app.use(function (err, req, res, next) {
    res.locals.message = err.message
    res.locals.error = err
    res.sendStatus(err.status || 500)
})

let connectionUrl = getMongodbConnectionUrl(mongoConf)
MongoClient.connect(connectionUrl).then(function (db) {
    app.locals.mongodb = db
    let port = process.env.PORT || 8004
    app.listen(port)
    console.log('Server is listening on ' + port)
})

module.exports = app
