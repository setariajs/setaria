import config from '../core/config'
import { getHttp } from '../plugin/http/index'
import { getStore } from '../plugin/store/index'
import { getRouter } from '../plugin/router/index'
import { getInitialStateData, refreshInitialState } from '../plugin/initial-state/index'
import Storage from './Storage'

export function initGlobalAPI (SDK, instance) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      console.warn(
        'Do not replace the SDK.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(SDK, 'config', configDef)

  SDK.getHttp = getHttp
  SDK.getRouter = getRouter
  SDK.getStore = getStore
  SDK.getInitialStateData = getInitialStateData
  SDK.refreshInitialState = refreshInitialState
  SDK.storage = Storage
}
