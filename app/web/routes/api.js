let express = require('express')
let router = express.Router()
let ProgramModel = require('../../../lib/ProgramModel')
let { vifeng: vifengConf, webapp: webappConf } = require('../../../config')

let allowTypes = ['mp41M', 'mp3']

router.get('/programs/', function (req, res, next) {
    let programIds = Object.keys(vifengConf.programs)

    return Promise.all(programIds.map(function (programId) {
        let programModel = new ProgramModel(programId, {db: req.app.locals.mongodb})
        return programModel.readProgramInfo()
    })).then(function (infos) {
        let programs = infos.map(function (info, index) {
            let programId = programIds[index]
            let program = vifengConf.programs[programId]
            return info ? {
                name: info.name,
                headPic: program.album || info.headPic,
                programId
            } : null
        }).filter(function (item) {
            return item
        })

        res.json({
            status: 'ok',
            data: programs
        })
    })
})

router.get('/program/:programId/', function (req, res, next) {
    let programId = req.params.programId.trim()
    let program = vifengConf.programs[programId]
    // console.log(programId)
    if (!program) {
        next('route')
        return
    }

    let programModel = new ProgramModel(programId, {db: req.app.locals.mongodb})
    programModel.readProgramInfo().then(function (data) {
        if (program.album) {
            data.headPic = program.album
        }
        res.json({
            status: 'ok',
            data: programInfoDataAdapter(data)
        })
    })
})

router.get('/program/items/:programId/', function (req, res, next) {
    let programId = req.params.programId.trim()
    if (!vifengConf.programs[programId]) {
        next('route')
        return
    }

    let {pageNo, pageSize} = req.query
    pageNo = parseInt(pageNo, 10) || 1
    pageSize = parseInt(pageSize, 10) || webappConf.pageCount

    let programModel = new ProgramModel(programId, {db: req.app.locals.mongodb})
    programModel.readProgramItems(pageNo, pageSize).then(function (data) {
        res.json({
            status: 'ok',
            data: data.map(programItemDataAdapter).map(function (item) {
                item.videos = item.videos.map(function (video) {
                    video.mediaUrl = ''
                    return video
                })
                return item
            })
        })
    })
})

router.get('/program/item/:programId/:itemId/', function (req, res, next) {
    let {programId, itemId} = req.params
    let program = vifengConf.programs[programId]
    if (!program) {
        next('route')
        return
    }

    let programModel = new ProgramModel(programId, {db: req.app.locals.mongodb})
    Promise.all([
        programModel.readProgramInfo(),
        programModel.readProgramItem(itemId)
    ]).then(function ([program, itemData]) {
        res.json({
            status: 'ok',
            data: Object.assign(programItemDataAdapter(itemData), {
                program: programInfoDataAdapter(program)
            })
        })
    })
})

router.post('/program/item/:programId/', function (req, res, next) {
    let {programId} = req.params
    let program = vifengConf.programs[programId]
    if (!program) {
        next('route')
        return
    }

    let programModel = new ProgramModel(programId, {db: req.app.locals.mongodb})
    Promise.all([
        programModel.readProgramInfo(),
        programModel.readProgramItem(itemId)
    ]).then(function ([program, itemData]) {
        res.json({
            status: 'ok',
            data: Object.assign(programItemDataAdapter(itemData), {
                program: programInfoDataAdapter(program)
            })
        })
    })
})

router.use('*', function (req, res, next) {
    res.json({
        status: 'fail',
        message: 'not found'
    }).end()
})

module.exports = router

function programInfoDataAdapter(item) {
    ['_id', 'weMediaID', 'followNo', 'followed', 'totalNum', 'totalPage'].forEach(function (key) {
        item[key] = undefined
    })
    return item
}

function programItemDataAdapter(item) {
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
        itemId: item.itemId,
        album: item.imageList[0].image,
        createDate: member.createDate,
        updateDate: member.updateDate,
        duration: member.duration,
        programNo: member.programNo,
        videos
    }
}
