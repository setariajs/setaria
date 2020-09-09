/* @flow */
import { isNotEmpty } from '../../util/lang'
import Storage from '../../global-api/Storage'
import { ROUTER_SESSION_STORAGE_QUERY_KEY_PREFIX } from '../../shared/constants'

function getWindowLocation (isTop) {
  let targetWindow = window
  if (isTop && targetWindow !== window.top) {
    targetWindow = window.top
  }
  return targetWindow.location
}

const decode = decodeURIComponent

export function parseQuery (query: string) {
  const res = {}

  query = query.trim().replace(/^(\?|#|&)/, '')

  if (!query) {
    return res
  }

  query.split('&').forEach(param => {
    const parts = param.replace(/\+/g, ' ').split('=')
    const key = decode(parts.shift())
    const val = parts.length > 0
      ? decode(parts.join('='))
      : null

    if (res[key] === undefined) {
      res[key] = val
    } else if (Array.isArray(res[key])) {
      res[key].push(val)
    } else {
      res[key] = [res[key], val]
    }
  })

  return res
}

/**
 * 取得指定query parameter的值
 */
export function getQueryParameter (key: string, isTop) {
  // 取得当前window对象的location
  const location = getWindowLocation(isTop) || {}
  const { search } = location || ''
  const queryParameters = parseQuery(search) || {}
  return queryParameters[key]
}

/**
 * 关闭当前窗口
 */
export function closeCurrentWindow () {
  // (Chrome)This method is only allowed to be called for windows that were opened by a script using the window.open() method
  let targetWindow = window
  // 找寻顶层window实例
  if (window.top !== window) {
    targetWindow = window.top
  }
  targetWindow.close()
}

/**
 * 根据url和query属性生成保存在Storage里的key值
 */
export function generateStorageKeyByUrlQueryAttribute (url: string, queryKey: string) {
  return `${ROUTER_SESSION_STORAGE_QUERY_KEY_PREFIX}_${url}_${queryKey}_${Math.floor(Math.random() * 1000000000)}`
}

/**
 * 是否存在保存在Storage内的key
 *
 * @export
 * @param {string} key
 */
export function isStorageKeyExistInQueryParameter (key: string) {
  if (typeof key === 'string' && isNotEmpty(key)) {
    return key.indexOf(ROUTER_SESSION_STORAGE_QUERY_KEY_PREFIX) === 0
  }
  return false
}

/**
 * 保存复杂类型的值
 *
 * @export
 * @param {string} key
 * @param {*} value
 */
export function setQueryValueByStorageKey (key: string, value: any) {
  Storage.setSessionItem(key, value)
}

/**
 * 取得指定复杂类型的值
 *
 * @export
 * @param {string} key
 */
export function getQueryValueByStorageKey (key: string) {
  return Storage.getSessionItem(key)
}

/**
 * 当前环境是否支持history.state
 */
export function supportsPushState () {
  const ua = window.navigator.userAgent

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
}
