let path = require('path')

let {router} = require('../nuxt.config')

export function getApiUrl(url, {isServer}) {
  return (isServer ? process.env.apiBaseUrl : '') + path.join(router.base, url)
}

export function apiResponseAdapter({data}) {
  if (data.status === 'ok') {
    return data.data
  }
  return new Error(data.message)
}

export function formatDuration(duration) {
  // TODO: support hours
  let m = ~~(duration / 60)
  let s = duration % 60
  return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
}

export function formatFileSize(filesize) {
  // TODO: support more units
  return `${(filesize / 1024).toFixed(2)}M`
}

export function formatProgramNo(source) {
  return `${source.substring(0, 4)}年${source.substring(4, 6)}月${source.substring(6, 8)}日`
}
