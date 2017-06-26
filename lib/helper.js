
exports.promisify = promisify

function promisify(func) {
    return function (...args) {
        return new Promise(function (resolve, reject) {
            return func.apply(null, args.concat(function (err, result) {
                if (err) {
                    reject(err.message)
                    return
                }
                resolve(result)
            }))
        })
    }
}
