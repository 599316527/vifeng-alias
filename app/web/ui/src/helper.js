
export function getJson (url, options) {
  return fetch(url, options).then(function (response) {
    return response.json()
  }).then(function (data) {
    if (data.status === 'ok') {
      return data.data
    }
    return Promise.reject(new Error(data.message))
  })
}
