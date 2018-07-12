import * as R from 'ramda'

export function merge (obj1, obj2) {
  return R.merge(obj1, obj2)
}

export function pathOr (defaultValue, path, obj) {
  return R.pathOr(defaultValue, path, obj)
}

export function propOr (defaultValue, key, obj) {
  return R.propOr(defaultValue, key, obj)
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
