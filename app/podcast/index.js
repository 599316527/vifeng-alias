
let path = require('path')
let etpl = require('etpl')
let fs = require('fs')
let promisify = require('../../lib/helper').promisify

let podcastConf = require('../../config').podcast

etpl.addFilter('strip-tags', function (source, useExtra) {
    return source.replace(/\<\/?[a-z][^\>]*\>/ig, '').trim();
})

exports.generateFeed = generateFeed

function generateFeed({info, items}, {programId, mediaType}) {
    return promisify(fs.readFile)(path.resolve(__dirname, 'tpl/feed.xml'), 'utf8').then(function (tplContent) {
        let content = etpl.compile(tplContent)({
            programId,
            mediaType,
            feedUrl: `${podcastConf.feedBaseUrl}/${mediaType}/${programId}.xml`,
            year: (new Date()).getYear(),
            info,
            items: itemsAdapter(items, mediaType)
        })
        return promisify(fs.writeFile)(path.join(__dirname, '/dist', `${programId}-${mediaType}.xml`), content)
    })
}

function itemsAdapter(items, mediaType) {
    let useTypes = {
        video: 'mp41M',
        audio: 'mp3'
    }

    return items.map(function (item) {
        let member = item.memberItem
        let file = member.videoFiles.filter(function (file) {
            return file.useType === useTypes[mediaType]
        })[0]

        return {
            title: member.name,
            subtitle: convProgramNo(member.programNo),
            author: member.cpName,
            desc: item.abstractDesc,
            image: item.imageList[0].image,
            guid: member.guid,
            pubData: convDate(member.createDate),
            link: member.mUrl,

            duration: member.duration,
            mediaUrl: file.mediaUrl,
            mimeType: getMimeType(file.mediaUrl),
            filesize: file.filesize
        }
    })
}

function convDate(source) {
    if (!/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.test(source)) {
        return source;
    }
    var d = new Date();
    d.setUTCFullYear(parseInt(RegExp.$1, 10));
    d.setUTCMonth(parseInt(RegExp.$2, 10) - 1);
    d.setUTCDate(parseInt(RegExp.$3, 10));
    d.setUTCHours(parseInt(RegExp.$4, 10));
    d.setUTCMinutes(parseInt(RegExp.$5, 10));
    d.setUTCSeconds(parseInt(RegExp.$6, 10));
    return d.toUTCString();
}

function convProgramNo(source) {
    return `${source.substring(0, 4)}年${source.substring(4, 6)}月${source.substring(6, 8)}日`
}

function getMimeType(source) {
    return {
        'mp4': 'video/mp4',
        'mp3': 'audio/mp3',
    }[source.substring(source.lastIndexOf('.') + 1)]
}

