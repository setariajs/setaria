import { getStore } from '../../../../plugin/store/index'
import { HTTP, STORE_KEY } from '../../../../shared/constants'
import { isNotEmpty } from '../../../../util/lang'

export default function commonHandler (response) {
  const { config, headers } = response
  // 设置取得xsrf token的场合，将服务端返回的xsrf写入缓存
  if (config[HTTP.GET_XSRF] && headers[config.xsrfHeaderName]) {
    getStore().commit(STORE_KEY.SET_XSRF, headers[config.xsrfHeaderName])
  }
  const { traceId, oddNumber } = response.data
  if (isNotEmpty(oddNumber)) {
    getStore().commit(STORE_KEY.SET_ODD_NUMBER, oddNumber)
  }
  if (isNotEmpty(traceId)) {
    getStore().commit(STORE_KEY.SET_REQUEST_ID, traceId)
  }
  // debug模式
  if (response.config.headers.clientDebugMode){
    getStore().commit(STORE_KEY.SET_DEBUG_REQUEST_LIST, {
      responseData: response.data,
      url: response.config.url,
      requestData: response.config.data,
      method: response.config.method
    })
  }
  return response
}
