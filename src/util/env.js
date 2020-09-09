export const inBrowser = typeof window !== 'undefined'
export const UA = inBrowser && window.navigator.userAgent.toLowerCase()
export const isIE = UA && /msie|trident/.test(UA)
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0
export const isEdge = UA && UA.indexOf('edge/') > 0
export const isAndroid = (UA && UA.indexOf('android') > 0)
export const isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA))
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge
export const isPhantomJS = UA && /phantomjs/.test(UA)
export const isFF = UA && UA.match(/firefox\/(\d+)/)

/**
 * 取得当前站点协议、域名和端口号
 */
export const getLocationOrigin = () => {
  if (window.location.origin) {
    return window.location.origin
  }
  if (isIE) {
    const { host, protocol } = window.location
    let { port } = window.location
    if (port !== '') {
      port = `:${port}`
    }
    return `${protocol}//${host}${port}`
  }
  return ''
}
