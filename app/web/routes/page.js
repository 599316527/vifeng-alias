let path = require('path')
let fs = require('fs')
let promisify = require('../../../lib/helper').promisify

let express = require('express')
let router = express.Router()

let podcastFeedXmlDir = path.resolve(__dirname, '../../podcast/dist')
router.get('/podcast/:mediaType/:programId.xml', function (req, res, next) {
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
    }).catch(function (err) {
        res.status(404).send(`No podcast supplied for ${mediaType}/${programId}`).end()
    })
})

let nuxt = require('../client/entry-express')
router.get('*', nuxt.render)

module.exports = router
