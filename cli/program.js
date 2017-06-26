let ProgramModel = require('../lib/ProgramModel')
let fetchProgram = require('../lib/ProgramFetcher').fetchProgram

exports.update = update

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
        console.log('节目«%s»已更新 (新增%d个, 修改%d个, 删除%d个)', weMedia.name,
            listResult.insertedCount, listResult.modifiedCount, listResult.deletedCount)
    })
}



