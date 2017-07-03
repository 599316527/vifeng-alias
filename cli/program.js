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

    return fetchProgram(programId, options.pageNo, options.pageCount).then(function ({weMedia, bodyList}) {
        let programModel = new ProgramModel(programId, {
            db: options.db
        })

        return Promise.all([
            Promise.resolve(weMedia),
            programModel.saveProgramInfo(weMedia),
            programModel.saveProgramItems(bodyList)
        ])
    }).then(function ([weMedia, infoResult, listResult]) {
        console.log('节目«%s»已更新', weMedia.name)
    })
}

function podcast(params, {
    mediaType, db, pageNo, pageCount
}) {
    let programId = params[0]
    if (!programId) {
        console.log('Please provide the program id')
        process.exit(1)
    }

    if (!mediaType) {
        mediaType = 'video'
    }

    let programModel = new ProgramModel(programId, { db })

    return Promise.all([
        programModel.readProgramInfo(),
        programModel.readProgramItems({pageNo, pageCount, filter: {
            memberItem: {
                videoFiles: {
                    $eachItem: {
                        useType: {
                            $in: ({
                                video: ['mp41M'],
                                audio: ['mp3']
                            }[mediaType])
                        }
                    }
                }
            }
        }})
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

