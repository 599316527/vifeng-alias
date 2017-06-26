
exports.promisify = promisify

function promisify(func) {
    return new Promise(function (resolve, reject) {
        return func(function (err, result) {
            if (err) {
                reject(err.message)
                return
            }
            resolve(result)
        })
    })
}
