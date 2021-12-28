import ServiceError from '../../../../global-object/ServiceError'
import subLoading from './subLoading'

function throwDefaultError (messageId, messagePrefix, error) {
  let errorCode = 'SYSMSG-SERVICE-UNKNOWN-ERROR'
  if (messageId !== '') {
    errorCode = `${messagePrefix}${messageId}`
  }
  throw new ServiceError(errorCode, null, error)
}

// error handler
export default function errorHandler (error) {
  // sub loading state count
  subLoading({
    config: error.config
  })
  // server have response
  if (error.response) {
    console.error('server have response', error, error.response)
    const messagePrefix = 'SYSMSG-SERVICE-STATUS-'
    let messageId = ''
    switch (error.response.status) {
      case 400:
        messageId = '400'
        break
      case 401:
        messageId = '401'
        break
      case 403:
        messageId = '403'
        break
      case 404:
        messageId = '404'
        break
      case 405:
        messageId = '405'
        break
      case 502:
        messageId = '502'
        break
      case 503:
        messageId = '503'
        break
      case 504:
        messageId = '504'
        break
      default:
        messageId = ''
    }
    if (error.response.data) {
      let responseData = error.response.data
      // 调用服务时若指定responseType为arraybuffer, 则axios返回的response.data类型为arraybuffer
      if (error.config.responseType === 'arraybuffer' && typeof responseData.byteLength === 'number') {
        try {
          responseData = JSON.parse(Buffer.from(responseData).toString('utf8'))
        } catch (e) {
          throwDefaultError(messageId, messagePrefix, error)
        }
      }
      const { code, message, traceId, oddNumber, success } = responseData
      // status为500的场合，显示服务器返回的自定义消息
      if (typeof success === 'boolean' && !success) {
        throw new ServiceError(code, message, error, null, traceId, oddNumber)
      }
    }
    throwDefaultError(messageId, messagePrefix, error)
  // The request was made but no response was received
  } else if (error.request) {
    console.error('The request was made but no response was received', error)
  // Something happened in setting up the request that triggered an Error
  } else {
    console.error('Something happened in setting up the request that triggered an Error', error)
    // timeout
    if (error.message.indexOf('timeout of ') === 0) {
      throw new ServiceError('SYSMSG-SERVICE-TIMEOUT', null, error, [error.config.timeout / 1000])
    // server unavaliable
    } else if (error.message.indexOf('Network Error') === 0) {
      throw new ServiceError('SYSMSG-SERVICE-NETWORK-ERROR', null, error)
    } else {
      throw new ServiceError('SYSMSG-SERVICE-UNKNOWN-ERROR', null, error)
    }
  }
  return Promise.reject(error)
}
