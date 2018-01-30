import Vue from 'vue'
import config from './config/index'
import { install } from './main'
import ApplicationError from './model/ApplicationError'
import ErrorHandler from './model/ErrorHandler'
import ServiceError from './model/ServiceError'
import Http from './model/Http'
import Message from './model/Message'
import Storage from './model/Storage'
import Navigate from './plugin/navigate/index'
import store, { types as storeTypes } from './plugin/store'
import util from './util'

// -- 环境变量设置
// 生产环境的场合
if (util.isProdunctionEnv()) {
  // 不显示Vue日志和警告
  Vue.config.silent = true
  // 不显示Vue产品信息
  Vue.config.productionTip = false
}

// -- 加载路由组件
const router = new Navigate(config.router)

// -- 异常处理
ErrorHandler.catchError()

export default {
  install,
  config,
  plugin: {
    router,
    store
  },
  version: '__VERSION__',
  ApplicationError,
  ServiceError,
  Http,
  Message,
  Storage,
  storeTypes,
  util
}
