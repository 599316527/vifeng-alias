
let argv = require('minimist')(process.argv.slice(2));
let MongoClient = require('mongodb').MongoClient
let program = require('./program')
let getMongodbConnectionUrl = require('../lib/UrlBuilder').getMongodbConnectionUrl
let { mongo: mongoConf } = require('../config')

const actionsWhichNeedDbConnection = ['update', 'podcast']

let action = argv._[0]

function main() {
    let shouldConnectDb = actionsWhichNeedDbConnection.indexOf(action) >= 0
    if (shouldConnectDb) {
        let connectionUrl = getMongodbConnectionUrl(mongoConf)
        return MongoClient.connect(connectionUrl)
    }
    return Promise.resolve()
}

main().then(function (db) {
    switch (action) {
        case 'update':
            program.update(argv._.slice(1), Object.assign({db}, argv))
                .then(promiseFinalExecutor).catch(promiseErrorCatcher)
            break;

        case 'podcast':
            program.podcast(argv._.slice(1), Object.assign({db}, argv))
                .then(promiseFinalExecutor).catch(promiseErrorCatcher)
            break;

        case 'help':
        default:
            console.log('node cli/index.js action programId [options]')
    }

    function promiseFinalExecutor() {
        db.close();
    }

    function promiseErrorCatcher({name, type, message, stack}) {
        console.log(`[${name}] ${message}
    ${stack}`)
        process.exit(1)
    }
})


