
let express = require('express')
let nuxt = require('../client/entry-express')

let router = express.Router()
router.get('*', nuxt.render)

module.exports = router
