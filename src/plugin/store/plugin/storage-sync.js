import config from '../../../core/config'
import { STORAGE_TYPE } from '../../../shared/constants'
import { getModulePathFromType, getModuleStateByModulePath, setSyncItem } from '../util'

/**
 * syncConfig: {
 *   '_root': 'local',
 *   'module1/module2': 'session'
 * }
 *
 * @export
 * @param {*} syncConfig
 * @returns
 */
export default function createStorageSyncPlugin (syncConfig) {
  return store => {
    // 会在每个 mutation 完成后调用，接收 mutation 和经过 mutation 后的状态作为参数
    store.subscribe(({ type }, state) => {
      // console.log(config.store, store, state)
      // 存在子模块的场合
      if (config.store !== null && config.store !== undefined &&
          config.store.modules !== null && config.store.modules !== undefined) {
        const modulePath = getModulePathFromType(type)
        // 存在指定子模块定义并设置了scope的场合
        const scope = syncConfig[modulePath]
        if (scope === STORAGE_TYPE.LOCAL || scope === STORAGE_TYPE.SESSION) {
          // 同步状态至Storage
          setSyncItem(scope, modulePath, getModuleStateByModulePath(state, modulePath))
        }
      }
    })
  }
}
