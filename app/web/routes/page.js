let path = require('path')
let fs = require('fs')
let uuidv4 = require('uuid/v4')
let fetch = require('node-fetch')
let { URLSearchParams } = require('url')
let promisify = require('../../../lib/helper').promisify
let { webapp: {ga} } = require('../../../config')

let express = require('express')
let router = express.Router()

let cidCookieOptions = {
    maxAge: 100 * 24 * 3600 * 1e3,
    httpOnly: true,
    secure: true
}

let podcastFeedXmlDir = path.resolve(__dirname, '../../podcast/dist')
router.get('/podcast/:mediaType/:programId.xml', function (req, res, next) {
    let docPath = path.join(req.baseUrl, req.path)

    let cdnHostname = 'qcdn.adeline.cc'
    // https://httpd.apache.org/docs/2.4/mod/mod_proxy.html#x-headers
    if (req.get('X-Forwarded-Host') !== cdnHostname) {
        res.redirect(301, `https://${cdnHostname}${docPath}`).end()
        return
    }

    // Support legacy 301 urls
    let cid = req.query.cid
    if (cid) {
        res.cookie('cid', cid, cidCookieOptions)
        res.redirect(301, docPath).end()
        return
    }

    cid = req.cookies.cid || uuidv4()
    res.cookie('cid', cid, cidCookieOptions)

    let {programId, mediaType} = req.params
    let filename = `${programId}-${mediaType}.xml`
    let file = path.join(podcastFeedXmlDir, filename)
    return promisify(fs.stat)(file).then(function (stats) {
        if (!stats.isFile()) {
            new Error(`Podcast ${filename} does not exist`)
        }
        return promisify(fs.readFile)(file, 'utf8')
    }).then(function (content) {
        res.type('xml').send(content).end()
        if (cid) {
            saveGoogleAnalyticsLog({
                cid,
                uip: req.ip,
                ua: req.get('User-Agent'),
                dh: req.hostname,
                dp: docPath
            })
        }
    }).catch(function (err) {
        res.status(404).send(`No podcast supplied for ${mediaType}/${programId}`).end()
    })
})

let nuxt = require('../client/entry-express')
router.use(nuxt.render)

module.exports = router

let googleAnalyticsLogs = []
function saveGoogleAnalyticsLog({cid, uip, ua, dh, dp}) {
    let log = (new URLSearchParams({
        v: 1,
        t: 'pageview',
        tid: ga.tid,
        cid,
        uip: uip.substring(uip.lastIndexOf(':') + 1),
        ua,
        dh,
        dp,
        ds: 'node',
        z: Date.now()
    })).toString()
    googleAnalyticsLogs.push(log)

    if (googleAnalyticsLogs.length > 15) {
        sendGoogleAnalyticsLogs(googleAnalyticsLogs)
        googleAnalyticsLogs = []
    }
}

function sendGoogleAnalyticsLogs(logs) {
    return fetch('https://www.google-analytics.com/batch', {
        method: 'POST',
        body: logs.join('\n')
    })
        // .then(function(res) {
        //     return res.text();
        // })
        // .then(function(data) {
        //     console.log(data)
        // }).catch(function(err) {
        //     console.log(err)
        // })
}

