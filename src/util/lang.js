import * as R from 'ramda'
import _ from 'lodash'

export function merge (obj1, obj2) {
  return R.merge(obj1, obj2)
}

export function mergeDeepRight (obj1, obj2) {
  return R.mergeDeepRight(obj1, obj2)
}

export function pathOr (defaultValue, path, obj) {
  return R.pathOr(defaultValue, path, obj)
}

export function propOr (defaultValue, key, obj) {
  return R.propOr(defaultValue, key, obj)
}

export function findIndex (list, fn) {
  return R.findIndex(fn)(list)
}

export function keys (val) {
  return _.keys(val)
}

export function isNotEmpty (val) {
  if (typeof val === 'number') {
    return true
  }
  if (val === null || val === undefined) {
    return false
  }
  return !R.isEmpty(val)
}

export function isEmpty (val) {
  return !isNotEmpty(val)
}

export function isArray (val) {
  return _.isArray(val)
}

export function clone (val) {
  return R.clone(val)
}

export function trim (val) {
  return R.trim(val)
}

/**
 * 检查列表/字符串是否以给定的值开头。
 */
export function startsWith (char, val) {
  return R.startsWith(char, val)
}

/**
 * 检查列表是否以指定的子列表结尾。
 * 同样的，检查字符串是否以指定的子字符串结尾。
 */
export function endsWith (char, val) {
  return R.endsWith(char, val)
}

/**
 * 转换成驼峰命名
 *
 * @export
 * @param {*} val
 * @returns
 */
export function camelCase (val) {
  return _.camelCase(val)
}

/**
 * 将字符转换成kebab命名
 *
 * @export
 * @param {*} val
 * @returns
 */
export function kebabCase (val) {
  return _.kebabCase(val)
}
