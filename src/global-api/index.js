import config from '../core/config'
import { getHttp } from '../plugin/http/index'
import { getStore } from '../plugin/store/index'
import { getRouter } from '../plugin/router/index'

export function initGlobalAPI (Setaria, instance) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      console.warn(
        'Do not replace the Setaria.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Setaria, 'config', configDef)

  Setaria.getHttp = getHttp
  Setaria.getRouter = getRouter
  Setaria.getStore = getStore
}
