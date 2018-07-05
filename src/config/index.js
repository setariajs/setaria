import message from './message'
import util from '../util'
let config = {
  $env: {},
  env: {
    dev: {},
    prod: {}
  },
  errorHanlder: null,
  message: {},
  router: {
    routes: []
  },
  auth: {
    storageMode: 'none'
  },
  storeSync: {}
}

// 取得配置文件
try {
  // 配置文件需与node_modules目录同级
  const customConfig = require(`${process.env.SETARIA_CONFIG_CONTEXT || process.cwd()}/setaria.config.js`)
  if (customConfig !== undefined && customConfig !== null) {
    config = util.assign({}, config, customConfig.default)
  }
  // 合并Setaria的系统错误
  config.message = util.assign({}, message, config.message)
} catch (e) {
}
// 加载CSS
// 根据环境设置env
const devEnv = util.get(config, 'env.dev', {})
let prodEnv = util.get(config, 'env.prod', {})
// 不区分环境的场合
if (util.isEmpty(devEnv) && util.isEmpty(prodEnv) && !util.isEmpty(config.env)) {
  prodEnv = config.env
}
// 保存原配置
config.$env = config.env
// 生产环境的场合
if (util.isProdunctionEnv()) {
  config.env = util.assign({}, prodEnv)
// 开发环境的场合
} else {
  config.env = util.assign({}, prodEnv, devEnv)
}

/* @flow */
export type Config = {
  css: ?Array<string>;
  env: ?Object;
  errorHanlder: ?Function;
  message: ?Object;
  router: ?Object;
  auth: ?Object;
}

export default config
