import Storage from '../../global-api/Storage'
import { isEmpty, isNotEmpty, pathOr, propOr } from '../../util/lang'

export const initSyncState = (globalStructure, syncConfig) => {
  Object.keys(syncConfig).forEach((modulePath) => {
    const scope = syncConfig[modulePath]
    let structure = null
    // 根节点的场合
    if (modulePath === MODULE_ROOT) {
      structure = globalStructure
    } else {
      structure = getModuleStructure(globalStructure, modulePath)
    }
    structure.state = syncState(structure.state, modulePath, scope)
  })
}

export const syncState = (states, modulePath, scope) => {
  const ret = {}
  const storageObject = getSyncItem(scope, modulePath)
  // Storage中不存在指定数据的场合
  if (isEmpty(storageObject)) {
    return states
  }
  Object.keys(states).forEach((key) => {
    ret[key] = propOr(states[key], key, storageObject)
  })
  return ret
}

const STORE_KEY_IN_STORAGE = '__setaria_store_sync'

// export const toObjectPath = (path) => path.replace(/\//g, '.')

const getStoreObjectByScope = (scope) => {
  let storeStorageObj = Storage.getItem(scope, STORE_KEY_IN_STORAGE)
  if (storeStorageObj === undefined || storeStorageObj === null) {
    storeStorageObj = {}
    Storage.setItem(scope, STORE_KEY_IN_STORAGE, storeStorageObj)
  }
  return storeStorageObj
}

export const setSyncItem = (scope, key, value) => {
  const storeStorageObj = getStoreObjectByScope(scope)
  storeStorageObj[key] = value
  Storage.setItem(scope, STORE_KEY_IN_STORAGE, storeStorageObj)
}

export const getSyncItem = (scope, key) => {
  return getStoreObjectByScope(scope)[key]
}

const MODULE_SEPARATE_STRING = '/'
const MODULE_ROOT = '_root'

/**
 * 取得Module同步信息
 * {
 *   '_root': 'local',
 *   'module1/module1-1': 'session'
 * }
 *
 * @export
 * @param {*} structure
 * @param {*} storeScopeKey
 * @returns
 */
export function createSyncConfigByStructure (structure, storeScopeKey) {
  const syncConfig = {}
  if (isNotEmpty(structure.scope)) {
    syncConfig[MODULE_ROOT] = structure.scope
  }
  if (isNotEmpty(structure.modules)) {
    Object.keys(structure.modules).forEach((key) => {
      path(syncConfig, storeScopeKey, structure.modules[key], key)
    })
  }
  console.debug('storeSyncConfig', syncConfig)
  return syncConfig
}

function path (syncConfig, storeScopeKey, structure, currentPath) {
  if (isNotEmpty(structure)) {
    if (isNotEmpty(structure.scope)) {
      syncConfig[currentPath] = structure.scope
    }
    if (isNotEmpty(structure.modules)) {
      Object.keys(structure.modules).forEach((key) => {
        path(syncConfig, storeScopeKey, structure.modules[key], `${currentPath}/${key}`)
      })
    }
  }
}

/**
 * get module path from mutation type
 * e.g.
 * 'module1/module1-1/set_xxx' -> 'module1/module1-1'
 *
 * @export
 * @param {String} type
 * @returns
 */
export function getModulePathFromType (type) {
  let ret = null
  if (type.indexOf(MODULE_SEPARATE_STRING) !== -1) {
    ret = type.substring(0, type.lastIndexOf(MODULE_SEPARATE_STRING))
  } else {
    ret = MODULE_ROOT
  }
  return ret
}

/**
 * get module structure
 *
 * @export
 * @param {Object} structure
 * @param {String} modulePath
 * @returns
 */
export function getModuleStructure (structure, modulePath) {
  const modulePathArr = getModulePathArrByString(modulePath)
  let s = structure
  // 根节点的场合
  if (modulePathArr.length === 0) {
    return s
  }
  const isFound = modulePathArr.every((path) => {
    const modules = s.modules
    if (modules === undefined || modules === null) {
      return false
    }
    if (modules[path] === undefined || modules[path] === null) {
      return false
    }
    s = modules[path]
    return true
  })
  if (isFound) {
    return s
  }
  return null
}

/**
 * 取得指定Store模块的状态
 *
 * @export
 * @param {Object} globalState
 * @param {String} modulePath
 * @returns
 */
export function getModuleStateByModulePath (globalState, modulePath) {
  // 根节点的场合
  if (modulePath === MODULE_ROOT) {
    return globalState
  }
  return pathOr(null, modulePath.split(MODULE_SEPARATE_STRING), globalState)
}

/**
 * getModulePathArrByString
 *
 * @private
 * @param {*} val
 * @returns
 */
function getModulePathArrByString (val) {
  // 根节点的场合，返回空数组
  let modulePathArr = []
  if (val.indexOf(MODULE_SEPARATE_STRING) !== -1) {
    // 'a/b' => ['a', 'b']
    modulePathArr = val.split(MODULE_SEPARATE_STRING)
  } else {
    // '_root' => []
    // 'module1' => ['module1']
    if (val !== MODULE_ROOT) {
      modulePathArr = [val]
    }
  }
  return modulePathArr
}
