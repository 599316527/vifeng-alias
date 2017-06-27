let express = require('express')
let router = express.Router()
let ProgramModel = require('../../../lib/ProgramModel')
let { vifeng: vifengConf, webapp: webappConf } = require('../../../config')


router.get('/program/:programId/', function (req, res, next) {
    let programId = req.params.programId.trim()
    // console.log(programId)
    if (!vifengConf.programs[programId]) {
        res.json({
            status: 'fail',
            message: 'not found'
        })
        return
    }

    let programModel = new ProgramModel(programId, {db: req.app.locals.mongodb})
    programModel.readProgramInfo().then(function (data) {
        res.json({
            status: 'ok',
            data
        })
    })
})

router.get('/program/items/:programId/:pageNo/', function (req, res, next) {
    let programId = req.params.programId.trim()
    if (!vifengConf.programs[programId]) {
        res.sendStatus(404)
        return
    }

    let pageNo = parseInt(req.params.pageNo, 10) || 1

    let programModel = new ProgramModel(programId, {db: req.app.locals.mongodb})
    programModel.readProgramItems(pageNo, webappConf.pageCount).then(function (data) {
        res.json({
            status: 'ok',
            data: programItemsDataAdapter(data)
        })
    })
})

module.exports = router

function programItemsDataAdapter(data) {
    let allowTypes = ['mp41M', 'mp3']
    return data.map(function (item) {
        let member = item.memberItem
        let videos = member.videoFiles.filter(function (file) {
            return allowTypes.indexOf(file.useType) >= 0
        }).map(function (file) {
            return {
                mediaUrl: file.mediaUrl,
                useType: file.useType,
                filesize: file.filesize,
            }
        })

        return {
            _id: item.id,
            title: item.title,
            desc: item.abstractDesc,
            author: member.cpName,
            album: item.imageList[0].image,
            createDate: member.createDate,
            updateDate: member.updateDate,
            duration: member.duration,
            programNo: member.programNo,
            videos
        }
    })
}


