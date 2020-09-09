import { getStore } from '../../../store/index'
import { STORE_KEY } from '../../../../shared/constants'

export default function subLoading (response) {
  const storeInstance = getStore()
  if (storeInstance && response.config && response.config.showLoading !== false) {
    storeInstance.commit(STORE_KEY.SUB_LOADING_COUNT)
  }
  return response
}
