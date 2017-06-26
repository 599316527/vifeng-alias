

let ProgramModel = require('./ProgramModel')
let fetchProgram = require('./ProgramFetcher').fetchProgram

module.exports = update

function update(programId, options) {
    return fetchProgram(programId, options.pageNo, options.pageCount)
        .then(function ({weMedia, bodyList}) {

        })
}





