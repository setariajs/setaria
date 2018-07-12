/* @flow */
import VueRouter from 'vue-router'
import config from '../../core/config'

let router

export function install (Vue, options) {
  // 安装VueRouter
  Vue.use(VueRouter)
  // 创建Vue Router实例
  router = new VueRouter(config.routes)
}

export function getRouter () {
  return router
}
