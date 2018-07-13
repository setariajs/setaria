import ServiceError from '../../../global-object/ServiceError'
import subLoading from './subLoading'

// error handler
export default function errorHandler (error) {
  // sub loading state count
  subLoading({
    config: error.config
  })
  // server have response
  if (error.response) {
    console.debug('server have response', error)
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
      default:
        messageId = ''
    }
    let message = 'SYSMSG-SERVICE-UNKNOWN-ERROR'
    if (messageId !== '') {
      message = `${messagePrefix}${messageId}`
    }
    throw new ServiceError(message, error)
  // The request was made but no response was received
  } else if (error.request) {
    console.debug('The request was made but no response was received', error)
  // Something happened in setting up the request that triggered an Error
  } else {
    console.debug('Something happened in setting up the request that triggered an Error', error)
    // timeout
    if (error.message.indexOf('timeout of ') === 0) {
      throw new ServiceError('SYSMSG-TIMEOUT', error, [error.config.timeout / 1000])
    // server unavaliable
    } else if (error.message.indexOf('Network Error') === 0) {
      throw new ServiceError('SYSMSG-SERVICE-NETWORK-ERROR', error)
    } else {
      throw new ServiceError('SYSMSG-SERVICE-UNKNOWN-ERROR', error)
    }
  }
  return Promise.reject(error)
}
