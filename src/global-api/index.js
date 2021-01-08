import config from '../core/config'
import { getHttp, createModuleDefaultBaseURL } from '../plugin/http/index'
import { getStore } from '../plugin/store/index'
import { getRouter } from '../plugin/router/index'
import { getInitialStateData, refreshInitialState } from '../plugin/initial-state/index'

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
  SDK.createModuleDefaultBaseURL = createModuleDefaultBaseURL
  SDK.getRouter = getRouter
  SDK.getStore = getStore
  SDK.getInitialStateData = getInitialStateData
  SDK.refreshInitialState = refreshInitialState
}
