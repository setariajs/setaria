import ServiceError from '../../../../global-object/ServiceError'

export default function businessErrorHandler (response) {
  // ContentType为application/json的场合
  if (response && response.headers &&
    response.headers['content-type'].indexOf('application/json') !== -1) {
    const { code, message, traceId, oddNumber, success } = response.data
    // when got business exception
    if (typeof success === 'boolean' && !success) {
      throw new ServiceError(code, message, null, null, traceId, oddNumber)
    }
  }
  return response
}
