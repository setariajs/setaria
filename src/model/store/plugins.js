import config from '../../config/index'
import util from '../../util'
import { setSyncItem, toObjectPath } from './util'

const storageSyncPlugin = store => {
  store.subscribe(({ type, payload }, state) => {
    Object.keys(config.storeSync).forEach(moduleKey => {
      // 根据定义进行同步
      if (type.indexOf(moduleKey) === 0) {
        const scope = config.storeSync[moduleKey]
        setSyncItem(scope, moduleKey, util.get(state, toObjectPath(moduleKey)))
      }
    })
  })
}

export default [storageSyncPlugin]
