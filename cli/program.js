let ProgramModel = require('../lib/ProgramModel')
let fetchProgram = require('../lib/ProgramFetcher').fetchProgram
let podcastApp = require('../app/podcast')

exports.update = update
exports.podcast = podcast

function update(params, options) {
    let programId = params[0]
    if (!programId) {
        console.log('Please provide the program id')
        process.exit(1)
    }

    return fetchProgram(programId, options.pageNo, options.pageSize).then(function ({weMedia, bodyList}) {
        let programModel = new ProgramModel({
            db: options.db
        })

        return Promise.all([
            Promise.resolve(weMedia),
            programModel.saveProgramInfo(programId, weMedia),
            programModel.saveProgramItems(programId, bodyList)
        ])
    }).then(function ([weMedia, infoResult, listResult]) {
        console.log('节目«%s»已更新', weMedia.name)
    })
}

function podcast(params, {
    mediaType, db, pageNo, pageSize
}) {
    let programId = params[0]
    if (!programId) {
        console.log('Please provide the program id')
        process.exit(1)
    }

    if (!mediaType) {
        mediaType = 'video'
    }

    let programModel = new ProgramModel({ db })

    let filter = {
        'memberItem.videoFiles': {
            $elemMatch: {
                'useType': ({
                    video: 'mp41M',
                    audio: 'mp3'
                }[mediaType])
            }
        }
    }

    return Promise.all([
        programModel.readProgramInfo(programId),
        programModel.readProgramItems(programId, {
            pageNo,
            pageSize,
            filter
        })
    ]).then(function ([info, items]) {
        return podcastApp.generateFeed(
            {info, items},
            {
                mediaType,
                programId
            }
        )
    }).then(function () {
        console.log(`${programId}-${mediaType} 已更新`)
    })
}

