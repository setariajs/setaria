import { mergeDeepRight } from '../util/lang'
import defaultVueConfig from '../config/default-vue-config'

export function withDefaultVueConfig (customizeConfig) {
  return mergeDeepRight(defaultVueConfig, customizeConfig)
}

export default {
  withDefaultVueConfig
}
