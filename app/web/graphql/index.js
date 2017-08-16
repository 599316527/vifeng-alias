let fs = require('fs')
let path = require('path')
let { makeExecutableSchema } = require('graphql-tools')

let typeDefs = fs.readFileSync(path.resolve(__dirname, './typedefs.gql'), 'utf8')
let resolvers = require('./resolvers')

module.exports = makeExecutableSchema({
    typeDefs,
    resolvers
})
