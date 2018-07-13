import { getStore } from '../../store/index'
import { STORE_KEY } from '../../../shared/constants'

export default function addLoading (config) {
  const storeInstance = getStore()
  if (storeInstance && config.showLoading !== false) {
    storeInstance.commit(STORE_KEY.ADD_LOADING_COUNT)
  }
  return config
}
