/* @flow */
import ApplicationError from '../global-object/ApplicationError'
import { STORAGE_TYPE } from '../shared/constants'

const STORAGE_KEY = '__Setaria_SDK_Storage_'

export type SCOPE = 'local' | 'session'

/**
 * 取得指定生命周期的Storage实例。
 * 目前支持的生命周期：
 *   local: 永久存在，即使浏览器关闭也不会删除
 *   session: 浏览器使用期间存在，重新载入页面或恢复时也不会删除
 */
function getStorageInstance (scope: SCOPE): Object {
  let ret = null
  try {
    ret = (scope === STORAGE_TYPE.LOCAL) ? window.localStorage : window.sessionStorage
  } catch (error) {
    // 浏览器禁止Storage功能的场合
    throw new ApplicationError('SYSMSG-NOT-SUPPORT-STORAGE')
  }
  // 不支持localStorage和sessionStorage的场合
  if (ret === undefined) {
    throw new ApplicationError('SYSMSG-NOT-SUPPORT-STORAGE')
  }
  return ret
}

/**
 * 更新指定Storage实例内的Store对象
 */
function setStorageObjectByScope (scope: SCOPE, storageObject: Object): void {
  const storage = getStorageInstance(scope)
  storage.setItem(STORAGE_KEY, JSON.stringify(storageObject))
}

/**
 * 取得指定Storage实例内的Store对象
 * @param  {String} scope 生命期
 * @return {Object} Store对象
 */
function getStorageObjectByScope (scope: SCOPE): Object {
  const storage: Object = getStorageInstance(scope)
  const storageObject: ?Object = storage.getItem(STORAGE_KEY)
  // Storage对象没有被创建过的场合
  if (storageObject === null) {
    storage.setItem(STORAGE_KEY, JSON.stringify({}))
  }
  return JSON.parse(storage.getItem(STORAGE_KEY))
}

function checkScope (scope: SCOPE): Boolean {
  return Object.keys(STORAGE_TYPE).some(key => STORAGE_TYPE[key] === scope)
}

/**
 * 在指定生命周期的Storage实例内进行设值
 */
function setItem (scope: SCOPE, key: string, value?: any) {
  if (!checkScope(scope)) {
    return
  }
  const storageObject: Object = getStorageObjectByScope(scope)
  storageObject[key] = value
  setStorageObjectByScope(scope, storageObject)
}

/**
 * 在指定生命周期的Storage实例内进行取值
 */
function getItem (scope: SCOPE, key: string): ?any {
  if (!checkScope(scope)) {
    return
  }
  return getStorageObjectByScope(scope)[key]
}

/**
 * 删除指定生命周期的Storage实例内的指定值
 * @param  {String} scope 生命期
 * @param  {String} key   键
 */
function removeItem (scope: SCOPE, key: string): void {
  if (!checkScope(scope)) {
    return
  }
  const storageObject: Object = getStorageObjectByScope(scope)
  delete storageObject[key]
  setStorageObjectByScope(scope, storageObject)
}

/**
 * 删除指定生命周期的Storage实例内的所有值
 * @param  {String} scope 生命期
 */
function removeAllItem (scope: SCOPE): void {
  setStorageObjectByScope(scope, {})
}

export default class Storage {
  static setItem (scope: SCOPE, key: string, value?: any): void {
    setItem(scope, key, value)
  }
  static getItem (scope: SCOPE, key: string): ?any {
    return getItem(scope, key)
  }
  static setLocalItem (key: string, value: any): void {
    setItem(STORAGE_TYPE.LOCAL, key, value)
  }
  static getLocalItem (key: string): any {
    return getItem(STORAGE_TYPE.LOCAL, key)
  }
  static removeLocalItem (key: string): void {
    removeItem(STORAGE_TYPE.LOCAL, key)
  }
  static clearLocal (): void {
    removeAllItem(STORAGE_TYPE.LOCAL)
  }
  static setSessionItem (key: string, value: any): void {
    setItem(STORAGE_TYPE.SESSION, key, value)
  }
  static getSessionItem (key: string): any {
    return getItem(STORAGE_TYPE.SESSION, key)
  }
  static removeSessionItem (key: string): void {
    removeItem(STORAGE_TYPE.SESSION, key)
  }
  static clearSession (): void {
    removeAllItem(STORAGE_TYPE.SESSION)
  }
}
