
export function getApiUrl(url, {isServer}) {
  return (isServer ? process.env.apiBaseUrl : '') + url
}
