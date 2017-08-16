let Guid = require('guid')
let moment = require('moment')

let outernalMediaType = {
    'mp41M': 'VIDEO',
    'mp3': 'AUDIO'
}
let allowedTypes = Object.keys(outernalMediaType)

exports.programItemDataAdapter = function (item) {
    let member = item.memberItem
    let videos = member.videoFiles.filter(function (file) {
        return allowedTypes.indexOf(file.useType) >= 0
    }).map(function (file) {
        return {
            url: file.mediaUrl,
            type: outernalMediaType[file.useType],
            filesize: file.filesize,
        }
    })

    return {
        _id: item.id,
        programId: item.programId,
        title: item.title,
        desc: item.abstractDesc,
        author: member.cpName,
        itemId: item.itemId,
        album: item.imageList && item.imageList[0] ? item.imageList[0].image : '',
        createDate: member.createDate,
        updateDate: member.updateDate,
        duration: member.duration,
        programNo: member.programNo,
        media: videos
    }
}

exports.fulfillProgramItemData = function (item, type = 'create') {
    let updateDate = moment().format('YYYY-MM-DD HH:mm:ss')

    let videos = {
        'mp41M': {
            url: item.videoUrl,
            size: item.videoFileSize
        },
        'mp3': {
            url: item.audioUrl,
            size: item.audioFileSize
        }
    }
    let videoFiles = Object.keys(videos).map(function (key) {
        return {
            useType: key,
            mediaUrl: videos[key].url,
            filesize: parseInt(videos[key].size, 10) || 0,
            spliteTime: "",
            spliteNo: 6,
            isSplite: 1
        }
    }).filter(function (item) {
        return item.mediaUrl
    })

    let memberItem = {
        playTime: "0",
        commentNo: "0",
        shareTimes: "0",
        dislikeNo: "0",
        isColumn: "1",
        mUrl: "http://v.ifeng.com/",
        pcUrl: "http://v.ifeng.com/",
        searchPath: "55-56-",
        updateDate,
        videoFiles
    }
    if (item.duration) {
        memberItem.duration = item.duration
    }
    if (item.title) {
        memberItem.name = item.title
    }
    if (item.author) {
        memberItem.cpName = item.author
    }
    if (item.programNo) {
        memberItem.columnYear = item.programNo.substring(0, 4)
        memberItem.columnMonth = parseInt((item.programNo.substring(4)), 10) + ''
        memberItem.programNo = item.programNo
    }

    if (type === 'create') {
        memberItem.guid = Guid.raw()
        memberItem.createDate = updateDate
    }

    let ret = {
        manualCreated: true,
        showType: "standard",
        memberType: "video",
        tag: "原创",
        programId: item.programId,
        memberItem
    }

    if (item.title) {
        ret.title = item.title
    }
    if (item.desc) {
        ret.abstractDesc = item.desc
    }
    if (item.album) {
        ret.imageList = [{
            image: item.album
        }]
    }

    return ret
}

exports.mergeEpisodes = function (dist, ...sources) {
    return sources.reduce(function (dist, source) {
        let videoFiles = source.memberItem.videoFiles.reduce(function (prev, file) {
            let i = prev.findIndex(function (v) {
                return v.useType === file.useType
            })
            if (i >= 0) {
                prev.splice(i, 1, file)
            }
            else {
                prev.push(file)
            }
            return prev
        }, dist.memberItem.videoFiles || [])
        source.memberItem.videoFiles = videoFiles

        let memberItem = Object.assign(dist.memberItem, source.memberItem)
        source.memberItem = memberItem

        return Object.assign(dist, source)
    }, dist)
}
