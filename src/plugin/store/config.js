import { SETARIA_SDK_STORE_MODULE } from '../../shared/constants'
import common from './module/common'
import loading from './module/loading'
import systemConfig from './module/system-config'

export default {
  modules: {
    [SETARIA_SDK_STORE_MODULE]: common,
    loading,
    systemConfig
  },
  plugins: []
}
