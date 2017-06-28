
export function getApiUrl(url, {isServer}) {
  return (isServer ? process.env.apiBaseUrl : '') + url
}

export function apiResponseAdapter({data}) {
  if (data.status === 'ok') {
    return data.data
  }
  return new Error(data.message)
}
