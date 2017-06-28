let MongoClient = require('mongodb').MongoClient

let express = require('express')

let getMongodbConnectionUrl = require('../../lib/UrlBuilder').getMongodbConnectionUrl
let { mongo: mongoConf } = require('../../config')

let app = express()

app.use('/api', require('./routes/api'))
app.use('/', require('./routes/page'))

app.use(function (req, res, next) {
    let err = new Error()
    err.status = 404
    next(err)
})

app.use(function (err, req, res, next) {
    console.log(err.stack)
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
