import { ERROR_MSG_SPLICER } from '../shared/constants'

export function encodeErrorMessage (prefix, id, message) {
  return `${prefix}[${id}]${ERROR_MSG_SPLICER}${message}`
}
