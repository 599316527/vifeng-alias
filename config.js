
exports.mongo = {
    host: 'localhost:27017',
    database: 'vifeng',
    // auth: 'root:root'
}

const vifengApi = {
    baseUrl: 'https://vcis.ifeng.com/api',
    commonParams: {
        adapterNo: '7.4.1',
        protocol: '1.0.2'
    }
}

const userAgent = 'ifengPlayer/7.4.1 (iPhone; iOS 10.3.2; Scale/2.00)'

const programs = {
    qqsrx: {
        weMediaId: 12
    },
    yhyxt: {
        weMediaId: 104
    }
}

exports.vifeng = {
    api: vifengApi,
    userAgent,
    programs
}
