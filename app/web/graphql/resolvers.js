let express = require('express')
let { vifeng: vifengConf, webapp: webappConf } = require('../../../config')
let ProgramModel = require('../../../lib/ProgramModel')
let eventBus = require('../eventBus')
let { validateRecaptcha, validateUsernamePassword } = require('../util')
let { programItemDataAdapter, fulfillProgramItemData, mergeEpisodes } = require('./adapters')

let programModel = new ProgramModel({})
eventBus.on('app-listening', function ({mongodb}) {
    programModel.db = mongodb
})

exports.Query = {
    programs(root, params, context) {
        return programModel.readPrograms()
    },

    program(root, {programId}, context) {
        let program = vifengConf.programs[programId]
        return programModel.readProgramInfo(programId).then(function (data) {
            if (program && program.album) {
                data.headPic = program.album
            }
            return data
        })
    },

    episodes(root, {
        programId,
        pageNo = 1,
        pageSize = webappConf.pageSize,
        keyword = ''
    }, context) {
        let filter = buildEpisodeKeywordFilter(keyword)
        return programModel.readProgramItems(programId, {
            pageNo,
            pageSize,
            filter
        }).then(function (data) {
            return data.map(programItemDataAdapter)
        })
    },

    episode(root, {
        programId,
        itemId,
        type
    }, context) {
        return programModel.readProgramItem(programId, itemId).then(function (data) {
            data = programItemDataAdapter(data)
            if (type) {
                data.media = data.media.filter(function (medium) {
                    return medium.type === type
                })
            }
            return data
        })
    },

    recaptcha(root, params, context) {
        return webappConf.recaptcha
    }
}

exports.Mutation = {
    updateEpisode(root, {episode}, context) {
        return makeEpisodeUpdate(episode, Object.assign({db: programModel.db}, context))
    }
}

function buildEpisodeKeywordFilter(keyword) {
    if (/^20\d{6}$/.test(keyword)) {
        return {
            'memberItem.programId': keyword
        }
    }
    else if (keyword) {
        // MongoDB 社区版的 $text 不支持中文，用正则
        keyword = keyword
            .replace(/[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7F]/g, '')
            .trim()
            .replace(/\s+/g, '|')
        return {
            title: {
                $regex: keyword,
                $options: '$i'
            }
        }
    }
    return {}
}

async function makeEpisodeUpdate(episode, {uip, auth = {}, db}) {
    if (!auth || !auth.password || !auth.recaptcha) {
        throw new Error('Wrong paramters')
    }

    await validateRecaptcha({
        secret: webappConf.recaptcha.secretKey,
        response: auth.recaptcha,
        remoteip: uip
    })

    let [username, password] = auth.password.split(':')
    await validateUsernamePassword(username, password, {db})

    let {programId, itemId} = episode
    let data = {}
    let isCreate
    if (itemId) {
        isCreate = false
        data = await programModel.readProgramItem(programId, itemId)
        if (!data) {
            throw new Error('Episode does not exist')
        }
    }
    else {
        isCreate = true
        itemId = await getNewEpisodeItemId(programId, {db})
        data = {
            itemId,
            memberItem:{},
            imageList: []
        }
    }
    let newEpisode = mergeEpisodes(data, fulfillProgramItemData(episode, isCreate))
    newEpisode.manualCreated = username
    // console.log(require('util').inspect(newEpisode))
    await programModel.saveProgramItems(programId, [newEpisode])
    data = await programModel.readProgramItem(programId, itemId)
    return programItemDataAdapter(data)
}

function getNewEpisodeItemId(programId, {db}) {
    return programModel.readProgramItems(programId, {
        filter: {
            itemId: /^9\d{7}$/
        },
        sort: {
            itemId: -1
        }
    }).then(function (data) {
        let itemId = '90000001'
        if (data && data.length) {
            itemId = data.map(function ({itemId}) {
                return itemId
            })[0]
        }
        return parseInt(itemId, 10) + 1 + ''
    })
}




