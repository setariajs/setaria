import { ERROR_MSG_SPLICER } from '../shared/constants'

export function encodeErrorMessage (prefix, code, message, showType) {
  return `${prefix}[${code}]${ERROR_MSG_SPLICER}{${showType}}${ERROR_MSG_SPLICER}${message}`
}
