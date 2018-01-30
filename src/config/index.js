import message from './message'
import util from '../util'

let config = {
  $env: {},
  env: {
    dev: {},
    prod: {}
  },
  message: {},
  router: {
    routes: []
  }
}
// 取得配置文件
try {
  // 配置文件需与node_modules目录同级
  const customConfig = require('../../../setaria.config.js')
  if (customConfig !== undefined && customConfig !== null) {
    config = customConfig.default
  }
  // 合并缺省框架内置系统错误
  config.message = Object.assign({}, message, customConfig.message)
} catch (e) {
  console.error('setaria.config.js文件不存在')
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
  config.env = Object.assign({}, prodEnv)
// 开发环境的场合
} else {
  config.env = Object.assign({}, prodEnv, devEnv)
}

/* @flow */
export type Config = {
  css: ?Array<string>;
  env: ?Object;
  errorHanlder: ?Function;
  message: ?Object;
  router: ?Object;
}
export default config
