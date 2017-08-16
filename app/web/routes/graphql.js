let path = require('path')
let express = require('express')
let { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
let graphqlScehma = require('../graphql')
let { webapp: webappConf } = require('../../../config')

let router = express.Router()

if (process.env.NODE_ENV === 'development') {
    let endpointURL = path.join(webappConf.baseUrl, '/graphql')
    router.use('/client', graphiqlExpress({endpointURL}))
}

router.use(graphqlExpress(function (req, res) {
    let auth = {
        password: req.get('X-vifeng-password'),
        recaptcha: req.get('X-vifeng-recaptcha')
    }
    auth = Object.keys(auth).reduce(function (prev, key) {
        if (auth[key]) {
            prev[key] = auth[key]
        }
        return prev
    }, {})

    let context = {
        uip: req.get('X-Forwarded-For') || req.ip
    }
    if (Object.keys(auth).length) {
        context.auth = auth
    }

    return {
        schema: graphqlScehma,
        context
    }
}))

module.exports = router
