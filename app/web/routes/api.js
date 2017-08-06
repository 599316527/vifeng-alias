let Guid = require('guid')
let moment = require('moment')
let express = require('express')
let fetch = require('node-fetch')
let FormData = require('form-data')
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
            }: null
        }).filter(function (item) {
            return item
        })

        res.json({
            status: 'ok',
            data: programs
        }).end()
    }).catch(function (err) {
        next(err)
    })
})

router.get('/program/:programId/', function (req, res, next) {
    let programId = req.params.programId.trim()
    let program = vifengConf.programs[programId]
    // console.log(programId)
    if (!program) {
        throw new Error('Unacceptable programId')
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
    }).catch(function (err) {
        next(err)
    })
})

router.get('/program/items/:programId/', function (req, res, next) {
    let programId = req.params.programId.trim()
    if (!vifengConf.programs[programId]) {
        throw new Error('Unacceptable programId')
    }

    let {pageNo, pageSize, keyword} = req.query
    pageNo = parseInt(pageNo, 10) || 1
    pageSize = parseInt(pageSize, 10) || webappConf.pageCount

    let filter = {}
    if (keyword) {
        filter = {
            $text: {
                $search: keyword
            }
        }
    }

    let programModel = new ProgramModel(programId, {db: req.app.locals.mongodb})
    programModel.readProgramItems({pageNo, pageSize, filter}).then(function (data) {
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
    }).catch(function (err) {
        next(err)
    })
})

router.get('/program/item/:programId/:itemId/', function (req, res, next) {
    let {programId, itemId} = req.params
    let program = vifengConf.programs[programId]
    if (!program) {
        throw new Error('Unacceptable programId')
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
    }).catch(function (err) {
        next(err)
    })
})

router.post('/program/item/:programId/', function (req, res, next) {
    let programId = req.body.programId
    let program = vifengConf.programs[programId]
    if (!program || !req.body.recaptchaResponse) {
        throw new Error('Unacceptable parameters')
    }

    let programModel = new ProgramModel(programId, {db: req.app.locals.mongodb})
    let [username, password] = req.body.password.split(':')

    let recaptchaFormData = new FormData()
    recaptchaFormData.append('secret', webappConf.recaptcha.secretKey)
    recaptchaFormData.append('response', req.body.recaptchaResponse)
    recaptchaFormData.append('remoteip', req.ip)

    fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: recaptchaFormData.getHeaders(),
        body: recaptchaFormData
    })
        .then(function(res) {
            return res.json();
        })
        .then(function({success}) {
            if (!success) {
                throw new Error('recaptcha error')
            }
            return Promise.resolve()
        })
        .then(function () {
            return req.app.locals.mongodb.collection('manager')
                .find({ username })
                .toArray()
        })
        .then(function (users) {
            let validated = users.length && users.every(function (user) {
                return user.username === username
                    && user.password === password
            })
            if (!validated) {
                throw new Error('Unacceptable password')
            }
            return Promise.resolve()
        })
        .then(function () {
            return programModel.readProgramItems({
                itemId: /^9\d{7}$/
            })
        })
        .then(function (data) {
            let itemId = '90000001'
            if (data && data.length) {
                itemId = data.map(function ({itemId}) {
                    return itemId
                }).sort(function (a, b) {
                    return a < b ? 1 : -1
                })[0]
            }
            itemId = parseInt(itemId, 10) + 1

            let programItemData = fulfillProgramItemData(req.body)
            programItemData.itemId = itemId + ''
            programItemData.manualCreated = username
            return programModel.saveProgramItems([programItemData])
        })
        .then(function (data) {
            res.json({
                status: 'ok',
                data: null
            })
        })
        .catch(function (err) {
            next(err)
        })
})

router.get('/recaptcha', function (req, res, next) {
    res.json({
        status: 'ok',
        data: {
            siteKey: webappConf.recaptcha.siteKey
        }
    }).end()
})

router.use('*', function (err, req, res, next) {
    res.json({
        status: 'fail',
        message: err.message
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

function fulfillProgramItemData(item) {
    let duration = parseInt(item.duration, 10)
    let guid = Guid.raw()
    let createDate = moment().format('YYYY-MM-DD HH:mm:ss')

    let videos = {
        'mp41M': {
            url: item.videoUrl,
            size: item.videoFileSize
        },
        'mp3': {
            url: item.audioUrl,
            size: item.audioFileSize
        }
    }
    let videoFiles = Object.keys(videos).map(function (key) {
        return {
            useType: key,
            mediaUrl: videos[key].url,
            filesize: parseInt(videos[key].size, 10) || 0,
            spliteTime: "",
            spliteNo: 6,
            isSplite: 1
        }
    }).filter(function (item) {
        return item.mediaUrl
    })

    let memberItem = Object.assign({
        playTime: "0",
        commentNo: "0",
        shareTimes: "0",
        dislikeNo: "0",
        isColumn: "1",
        mUrl: "http://v.ifeng.com/",
        pcUrl: "http://v.ifeng.com/",
        searchPath: "55-56-"
    }, {
        duration,
        guid,
        createDate,
        updateDate: createDate,
        columnYear: item.programNo.substring(0, 4),
        columnMonth: parseInt((item.programNo.substring(4)), 10) + '',
        programNo: item.programNo,
        name: item.title,
        cpName: item.author,
        videoFiles
    })

    return Object.assign({
        manualCreated: true,
        showType: "standard",
        memberType: "video",
        itemId: '',
        tag: "原创"
    }, {
        programId: item.programId,
        title: item.title,
        imageList: [{
            image: item.album
        }],
        abstractDesc: item.desc,
        memberItem
    })
}

