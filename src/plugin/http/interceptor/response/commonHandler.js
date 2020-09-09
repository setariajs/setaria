import { getStore } from '../../../../plugin/store/index'
import { STORE_KEY } from '../../../../shared/constants'
import { isNotEmpty } from '../../../../util/lang'

export default function commonHandler (response) {
  const { requestId, oddNumber } = response.data
  if (isNotEmpty(oddNumber)) {
    getStore().commit(STORE_KEY.SET_ODD_NUMBER, oddNumber)
  }
  if (isNotEmpty(requestId)) {
    getStore().commit(STORE_KEY.SET_REQUEST_ID, requestId)
  }
  //debug模式
  if(response.config.headers.clientDebugMode){
    getStore().commit(STORE_KEY.SET_DEBUG_REQUEST_LIST, {
      responseData:response.data,
      url:response.config.url,
      requestData:response.config.data,
      method:response.config.method
    })
  }
  return response
}
