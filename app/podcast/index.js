
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
    // return console.log(JSON.stringify(items,null,4))

    let customPodcastData = podcastConf.programs[programId]
    if (customPodcastData.category) {
        info.category = customPodcastData.category
    }
    let customPodcastAlbum = customPodcastData.album[mediaType]
    if (customPodcastAlbum) {
        info.headPic = customPodcastAlbum
    }

    return promisify(fs.readFile)(path.resolve(__dirname, 'tpl/feed.xml'), 'utf8').then(function (tplContent) {
        let content = etpl.compile(tplContent)({
            programId,
            mediaType,
            baseUrl: podcastConf.baseUrl,
            year: (new Date()).getFullYear(),
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
        let link = `${podcastConf.baseUrl}/program/media/${file.useType}/${item.itemId}`

        return {
            title: member.name,
            subtitle: convProgramNo(member.programNo),
            author: member.cpName,
            desc: item.abstractDesc,
            image: item.imageList[0].image,
            guid: member.guid,
            pubData: convDate(member.createDate),
            link,
            explicit: item.explicit,

            duration: member.duration,
            mediaUrl: file.mediaUrl,
            mimeType: getMimeType(file.mediaUrl),
            filesize: file.filesize
        }
    })
}

function convDate(source) {
    var d = new Date(source);
    return d.toUTCString();
}

function convProgramNo(source) {
    return `${source.substring(0, 4)}年${source.substring(4, 6)}月${source.substring(6, 8)}日`
}

function getMimeType(source) {
    return {
        'mp4': 'video/mp4',
        'mp3': 'audio/mp3',
        'm4a': 'audio/m4a'
    }[source.substring(source.lastIndexOf('.') + 1)]
}

