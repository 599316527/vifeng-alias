let fs = require('fs')
let path = require('path')
let express = require('express')
let etpl = require('etpl')

let ProgramModel = require('../../../lib/ProgramModel')
let { vifeng: vifengConf, webapp: webappConf } = require('../../../config')

let router = express.Router()

let etplRenders = ['page', 'programs', 'program'].reduce(function (ret, key) {
    let tplContent = fs.readFileSync(path.resolve(__dirname, `../tpl/${key}.etpl`), 'utf8')
    ret[key] = etpl.compile(tplContent)
    return ret
}, {})

router.get('/program', function (req, res, next) {
    let db = req.app.locals.mongodb
    let programIds = Object.keys(vifengConf.programs)

    return Promise.all(programIds.map(function (programId) {
        let programModel = new ProgramModel(programId, {db})
        return programModel.readProgramInfo()
    })).then(function (infos) {
        return infos.map(function (info, index) {
            return info ? {
                name: info.name,
                programId: programIds[index]
            } : null
        }).filter(function (item) {
            return item
        })
    }).then(function (programs) {
        let htmlContent = etplRenders.programs({
            pageTitle: 'vifeng',
            programs
        })

        res.type('html')
        res.send(htmlContent)
    })
})

module.exports = router
