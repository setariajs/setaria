import Util from '@/model/Util';

const STORAGE_KEY = Util.getConfigValue('STORAGE_KEY');

/**
 * Storage生命期类型
 * @type {Object}
 */
export const STORAGE_TYPE = {
  LOCAL: 'local',
  SESSION: 'session',
};

/**
 * 取得指定生命周期的Storage实例。
 * 目前支持的生命周期：
 *   local: 永久存在，即使浏览器关闭也不会删除
 *   session: 浏览器使用期间存在，重新载入页面或恢复时也不会删除
 * @param  {String}  scope 生命期
 * @return {Storage} Storage实例
 */
function getStorageInstance(scope) {
  let ret = null;
  switch (scope) {
    case STORAGE_TYPE.LOCAL:
      ret = window.localStorage;
      break;
    case STORAGE_TYPE.SESSION:
      ret = window.sessionStorage;
      break;
    default:
      ret = null;
  }
  return ret;
}

/**
 * 更新指定Storage实例内的Store对象
 * @param {String}  scope         生命期
 * @param {Object}  storageObject Store对象
 */
function setStorageObjectByScope(scope, storageObject) {
  const storage = getStorageInstance(scope);
  storage.setItem(STORAGE_KEY, JSON.stringify(storageObject));
}

/**
 * 取得指定Storage实例内的Store对象
 * @param  {String} scope 生命期
 * @return {Object} Store对象
 */
function getStorageObjectByScope(scope) {
  const storage = getStorageInstance(scope);
  // Storage对象没有被创建过的场合
  if (Util.isEmpty(storage.getItem(STORAGE_KEY))) {
    storage.setItem(STORAGE_KEY, JSON.stringify({}));
  }
  return JSON.parse(storage.getItem(STORAGE_KEY));
}

export default class Storage {
  /**
   * 在指定生命周期的Storage实例内进行设值
   * @param {String} scope 生命期
   * @param {String} key   键
   * @param {[type]} value 值
   */
  static setItem(scope, key, value) {
    const storageObject = getStorageObjectByScope(scope);
    storageObject[key] = value;
    setStorageObjectByScope(scope, storageObject);
  }

  /**
   * 在指定生命周期的Storage实例内进行取值
   * @param  {String} scope 生命期
   * @param  {String} key   键
   * @return {*}      取得的值
   */
  static getItem(scope, key) {
    const storageObject = getStorageObjectByScope(scope);
    return storageObject[key];
  }

  /**
   * 删除指定生命周期的Storage实例内的指定值
   * @param  {String} scope 生命期
   * @param  {String} key   键
   */
  static removeItem(scope, key) {
    const storageObject = getStorageObjectByScope(scope);
    delete storageObject[key];
    setStorageObjectByScope(scope, storageObject);
  }

  /**
   * 删除指定生命周期的Storage实例内的所有值
   * @param  {String} scope 生命期
   */
  static removeAllItem(scope) {
    const storageObject = getStorageObjectByScope(scope);
    if (!Util.isEmpty(storageObject)) {
      setStorageObjectByScope(scope, {});
    }
  }
}
