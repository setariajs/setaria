// import Vue from 'vue'
import { getHttp } from '../http/index'
import { getRouter } from '../router/index'
import { getStore } from '../store/index'
import { getI18n } from '../i18n/index'
import { STORE_KEY } from '../../shared/constants'
import { isEmpty, isNotEmpty } from '../../util/lang'

let getInitialStateFunction = null

export function refreshInitialState () {
  console.log('refreshInitialState')
  if (isEmpty(getInitialStateFunction)) {
    return null
  }
  return execInitialProcess(getInitialStateFunction, getHttp(), getRouter(), getStore())
}
export function getInitialStateData () {
  const ret = getStore().getters[STORE_KEY.GET_INITIAL_STATE]
  return isNotEmpty(ret) ? ret.data : null
}

export default function install (Setaria, Vue, options) {
  if (isEmpty(options)) {
    return
  }
  debugger
  const { entry, getInitialState, error, loading } = options
  // 实例化Vue根组件
  if (isNotEmpty(entry)) {
    // 进行异步处理，getInitialState函数必须返回Promise
    if (typeof getInitialState === 'function') {
      getInitialStateFunction = getInitialState
      Vue.component(
        'async-app',
        // 这个动态导入会返回一个 `Promise` 对象。
        () => (
          {
            // 需要加载的组件 (应该是一个 `Promise` 对象)
            component: new Promise((resolve, reject) => {
              execInitialProcess(getInitialState, getHttp(), getRouter(), getStore(), getI18n()).then(() => {
                resolve(entry)
              })
            }),
            // 异步组件加载时使用的组件
            loading,
            // 加载失败时使用的组件
            error,
            // 展示加载时组件的延时时间。默认值是 200 (毫秒)
            delay: 200,
            // 如果提供了超时时间且组件加载也超时了，
            // 则使用加载失败时使用的组件。默认值是：`Infinity`
            timeout: 3000
          }
        )
      )
      Setaria.vm = createRootVue(Vue, {
        el: entry.el,
        render: h => {
          return h('async-app')
        }
      })
      // option "el" can only be used during instance creation with the `new` keyword.
      if (entry.el) {
        delete entry.el
      }
    } else {
      Setaria.vm = createRootVue(Vue, entry)
    }
  }
}

function createRootVue (Vue, options) {
  if (isEmpty(options.sdk)) {
    options.sdk = {}
  }
  return new Vue(options)
}

function execInitialProcess (getInitialState, http, router, store, i18n) {
  return new Promise((resolve, reject) => {
    getInitialState({
      http,
      router,
      store,
      i18n
    }).then((res) => {
      store.commit(STORE_KEY.SET_INITIAL_STATE, {
        data: res
      })
      resolve(res)
    }).catch((error) => {
      store.commit(STORE_KEY.SET_INITIAL_STATE, {
        error
      })
      reject(error)
    })
  })
}
