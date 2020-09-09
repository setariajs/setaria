import CustomBusinessApiError from '../../../../global-object/CustomBusinessApiError'
import { API_RESPOSNE_CODE_TYPES } from '../../../../shared/constants'

export default function businessErrorHandler (response) {
  // ContentType为application/json的场合
  if (response && response.headers &&
    response.headers['content-type'].indexOf('application/json') !== -1) {
    const { code, message, requestId, oddNumber } = response.data
    // when got business exception
    if (code !== API_RESPOSNE_CODE_TYPES.SUCCESS) {
      throw new CustomBusinessApiError(code, message, null, requestId, oddNumber)
    }
  }
  return response
}
