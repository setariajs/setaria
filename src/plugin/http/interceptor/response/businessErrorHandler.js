import ServiceError from '../../../../global-object/ServiceError'
import { API_RESPOSNE_CODE_TYPES } from '../../../../shared/constants'

export default function businessErrorHandler (response) {
  // ContentType为application/json的场合
  if (response && response.headers &&
    response.headers['content-type'].indexOf('application/json') !== -1) {
    const { code, message, requestId, oddNumber } = response.data
    // when got business exception
    if (code !== API_RESPOSNE_CODE_TYPES.SUCCESS) {
      throw new ServiceError(code, message, null, requestId, oddNumber)
    }
  }
  return response
}
