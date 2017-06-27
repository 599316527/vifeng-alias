
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
    feedBaseUrl: 'https://hk1229.cn/vifeng/podcast/',
    programs: {
        qqsrx: {
            album: {
                video: 'https://storage.adeline.cc/image/podcast/qqsrx/video.jpg',
                audio: 'https://storage.adeline.cc/image/podcast/qqsrx/audio.jpg'
            }
        }
    }
}

exports.webapp = {
    pageCount: 20
}
