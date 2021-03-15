import { getStore } from '../../../store/index'
import { HTTP, STORE_KEY } from '../../../../shared/constants'

export default function addXsrf (config) {
  const storeInstance = getStore()
  if (storeInstance && config) {
    if (config[HTTP.GET_XSRF] === true) {
      config.headers[config.xsrfHeaderName] = 'fetch'
    } else if (config[HTTP.ADD_XSRF] === true) {
      config.headers[config.xsrfHeaderName] = storeInstance.getters[STORE_KEY.GET_XSRF]
    }
  }
  return config
}
