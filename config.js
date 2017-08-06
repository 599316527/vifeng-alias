
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
        weMediaId: 12,
        album: 'http://wx1.sinaimg.cn/large/661b7679gy1fi2ghxcp2gj218g18g0v8.jpg'
    },
    yhyxt: {
        weMediaId: 104
    },
    ssztc: {
        weMediaId: 74
    },
    xwjrt: {
        weMediaId: 22
    },
    zbjsj: {
        weMediaId: 24
    },
    jqgcs: {
        weMediaId: 100
    }
}

exports.vifeng = {
    api: vifengApi,
    userAgent,
    programs
}

exports.podcast = {
    baseUrl: 'https://hk1229.cn/vifeng',
    programs: {
        qqsrx: {
            album: {
                video: 'http://wx1.sinaimg.cn/large/661b7679gy1fi2ghxcp2gj218g18g0v8.jpg',
                audio: 'http://wx3.sinaimg.cn/large/661b7679gy1fhxks3ffcjj218g18gmz0.jpg'
            },
            category: 'Society & Culture'
        }
    }
}

exports.webapp = {
    pageCount: 20,
    baseUrl: '/vifeng',
    recaptcha: {
        siteKey: '6LfuXw4UAAAAAOOZ6tbepWc4NLIRr5GakiJ-IivB',
        secretKey: '6LfuXw4UAAAAAOS69u48Vfit6q7LKwU6rk66tovW'
    }
}
