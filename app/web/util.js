let FormData = require('form-data')

exports.validateRecaptcha = function (data) {
    let recaptchaFormData = new FormData()
    Object.keys(data).forEach(function () {
        recaptchaFormData.append(key, data[key])
    })

    return fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: recaptchaFormData.getHeaders(),
        body: recaptchaFormData
    }).then(function(res) {
        return res.json();
    }).then(function({success}) {
        if (!success) {
            throw new Error('recaptcha error')
        }
        return Promise.resolve()
    })
}

exports.validateUsernamePassword = function (username, password, {db}) {
    return db.collection('manager').find({ username }).toArray().then(function (users) {
        let validated = users.length && users.every(function (user) {
            return user.username === username
                && user.password === password
        })
        if (!validated) {
            throw new Error('Unacceptable password')
        }
        return Promise.resolve()
    })
}
