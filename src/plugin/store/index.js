/* @flow */
import Vuex from 'vuex'
import config from '../../core/config'
import storeConfig from './config'
import createStorageSyncPlugin from './plugin/storage-sync'
import { createSyncConfigByStructure, initSyncState } from './util'

let store

export function install (Vue, options) {
  // 安装Vuex
  Vue.use(Vuex)
  // 取得Vuex Store配置
  const storeStructure = mergeConfig(config.store, storeConfig)
  // 取得Module同步信息
  const syncConfig = createSyncConfigByStructure(storeStructure, config.storeScopeKey)
  // 注册插件
  initPlugin(storeStructure, syncConfig)
  // 初始化State
  initSyncState(storeStructure, syncConfig)
  // 创建Vuex Store实例
  store = new Vuex.Store(storeStructure)
}

export function getStore () {
  return store
}

function initPlugin (storeStructure, syncConfig) {
  storeStructure.plugins.push(createStorageSyncPlugin(syncConfig))
}

function mergeConfig (customStore, setariaStore) {
  const ret = customStore || {}
  // merge modules
  if (ret.modules === undefined || ret.modules === null) {
    ret.modules = {}
  }
  Object.keys(setariaStore.modules).forEach((key) => {
    ret.modules[key] = setariaStore.modules[key]
  })
  // merge plugins
  if (ret.plugins === undefined || ret.plugins === null) {
    ret.plugins = []
  }
  ret.plugins = setariaStore.plugins.concat(ret.plugins)
  return ret
}
