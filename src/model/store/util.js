import Storage from '../Storage'
import util from '../../util'

/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 * @param {Array|Object} map
 * @return {Object}
 */
function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }))
}

const initStateValue = (key, initialValue, syncObjectPath, scope) => {
  let storageValue = util.get(getSyncItem(scope, syncObjectPath), key)
  if (storageValue === undefined) {
    storageValue = initialValue
  }
  return storageValue
}

export const initState = (states, objectPath, scope) => {
  const ret = {}
  normalizeMap(states).forEach(({ key, val }) => {
    let initialValue = val
    initialValue = initStateValue(key, val, objectPath, scope)
    ret[key] = initialValue
  })
  return ret
}

const STORE_KEY_IN_STORAGE = '__setaria_store_sync'

export const toObjectPath = (path) => path.replace(/\//g, '.')

const getStoreObjectFromStorage = (scope) => {
  let storeStorageObj = Storage.getItem(scope, STORE_KEY_IN_STORAGE)
  if (storeStorageObj === undefined || storeStorageObj === null) {
    storeStorageObj = {}
    Storage.setItem(scope, STORE_KEY_IN_STORAGE, storeStorageObj)
  }
  return storeStorageObj
}

export const setSyncItem = (scope, key, value) => {
  const storeStorageObj = getStoreObjectFromStorage(scope)
  const item = util.get(storeStorageObj, key, {})
  util.assign(item, value)
  storeStorageObj[key] = item
  Storage.setItem(scope, STORE_KEY_IN_STORAGE, storeStorageObj)
}

export const getSyncItem = (scope, key) => {
  return getStoreObjectFromStorage(scope)[key]
}
