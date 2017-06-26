
exports.getMongodbConnectionUrl = getMongodbConnectionUrl
exports.getVifengApiUrl = getVifengApiUrl

function getMongodbConnectionUrl({host, database, auth = ''}) {
    // TODO: support multiple hosts
    return `mongodb://${auth ? auth + '@' : ''}${host}/${database}`
}

function getVifengApiUrl({baseUrl, commonParams}, apiPath, params) {
    let url = baseUrl + apiPath
    let queries = Object.assign({}, commonParams, params)
    return url + '?' + stringifyQueries(queries)
}

function stringifyQueries(queries) {
    return Object.keys(queries).map(function (key) {
        return `${key}=${encodeURIComponent(queries[key])}`
    }).join('&')
}
