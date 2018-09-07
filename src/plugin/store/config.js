import { SETARIA_STORE_MODULE } from '../../shared/constants'
import common from './module/common'
import loading from './module/loading'

export default {
  modules: {
    [SETARIA_STORE_MODULE]: common,
    loading
  },
  plugins: []
}
