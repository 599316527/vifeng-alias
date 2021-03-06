
let fetch = require('node-fetch')
let { vifeng: vifengConf } = require('../config')
let { getVifengApiUrl } = require('./UrlBuilder')

exports.fetchProgram = fetchProgram

function fetchProgram(programId, pageNo = 1, pageSize = 20) {
    let program = vifengConf.programs[programId]
    if (!program || !program.weMediaId) {
        return Promise.reject(`Program "${programId}" doesn't exist`)
    }

    let programApiUrl = getVifengApiUrl(vifengConf.api, '/weMediaVideoList', {
        weMediaID: program.weMediaId,
        pageNo,
        pageSize,
        platformType: 'iPhone',
        positionId: '',
        type: 'new',
        userID: '',
        t: ~~((new Date()).getTime() / 3)
    })

    return fetch(programApiUrl, {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'user-agent': vifengConf.userAgent
        }
    }).then(function(res) {
        return res.json();
    }).then(function({infoList}) {
        if (!infoList || !infoList[0]) {
            return Promise.reject(
                new Error(`Empty result for program ${programId}`)
            )
        }

        return infoList[0]
    })
}


