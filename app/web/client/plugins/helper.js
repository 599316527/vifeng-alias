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
