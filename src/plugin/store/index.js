/* @flow */
import Vuex from 'vuex'
import config from '../../core/config'
import storeConfig from './config'
import createStorageSyncPlugin from './plugin/storage-sync'
import { createSyncConfigByStructure, initSyncState } from './util'

const {
  createNamespacedHelpers,
  mapActions,
  mapGetters,
  mapMutations,
  mapState
} = Vuex

export default {
  createNamespacedHelpers,
  mapActions,
  mapGetters,
  mapMutations,
  mapState
}

let store

export function install (Vue, options) {
  // 安装Vuex
  Vue.use(Vuex)
  // 取得Vuex Store配置
  const storeStructure = mergeConfig(config.store, storeConfig)
  // 添加Actions属性的访问者，在Actions的执行前和执行后进行相应处理
  addActionVisitor('', storeStructure, '')
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

function addActionVisitor (moduleName, moduleStructure, currentModuleNames) {
  const { actions, modules, namespaced } = moduleStructure
  // 添加命名空间
  if (namespaced === true) {
    if (currentModuleNames.length > 0) {
      currentModuleNames = `${currentModuleNames}/${moduleName}`
    } else {
      currentModuleNames = moduleName
    }
  }
  if (actions) {
    Object.keys(actions).forEach((actionName) => {
      // action调用路径 (module_xxx/action)
      let actionFullName =
        `${currentModuleNames.length > 0 ? currentModuleNames + '/' : currentModuleNames}${actionName}`
      if (typeof actions[actionName] === 'function') {
        actions[actionName] = createActionVisitor(actionFullName, actions[actionName])
      // 命名空间的模块内注册的全局 action 的场合
      } else {
        if (actions[actionName].root === true) {
          actionFullName = actionName
        }
        if (typeof actions[actionName].handler === 'function') {
          actions[actionName].handler = createActionVisitor(actionFullName, actions[actionName].handler)
        }
      }
    })
  }
  if (modules) {
    Object.keys(modules).forEach((moduleName) => {
      addActionVisitor(moduleName, modules[moduleName], currentModuleNames)
    })
  }
}

function createActionVisitor (name, action) {
  return (context, payload) => {
    const result = action(context, payload)
    if (result && result.then) {
      getStore().commit('loading/updateActions', {
        name,
        status: true
      })
      return new Promise((resolve, reject) => {
        result.then((res) => {
          resolve(res)
          getStore().commit('loading/updateActions', {
            name,
            status: false
          })
        })
        .catch((err) => {
          reject(err)
          getStore().commit('loading/updateActions', {
            name,
            status: false
          })
        })
      })
    }
  }
}

function mergeConfig (customStore, sdkStore) {
  const ret = customStore || {}
  // merge modules
  if (ret.modules === undefined || ret.modules === null) {
    ret.modules = {}
  }
  Object.keys(sdkStore.modules).forEach((key) => {
    ret.modules[key] = sdkStore.modules[key]
  })
  // merge plugins
  if (ret.plugins === undefined || ret.plugins === null) {
    ret.plugins = []
  }
  ret.plugins = sdkStore.plugins.concat(ret.plugins)
  return ret
}
