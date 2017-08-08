import Vue from 'vue'
import config from './config/index'
import { install } from './main'
import ApplicationError from './model/ApplicationError'
import ErrorHandler from './model/ErrorHandler'
import Http from './model/Http'
import Message from './model/Message'
import util from './util'

// -- 环境变量设置
// 生产环境的场合
if (util.isProdunctionEnv()) {
  // 不显示Vue日志和警告
  Vue.config.silent = true
  // 不显示Vue产品信息
  Vue.config.productionTip = false
}

// -- 异常处理
ErrorHandler.catchError()

export default {
  install,
  config,
  version: '__VERSION__'
}

export {
  ApplicationError,
  Http,
  Message,
  util
}
