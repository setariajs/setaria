import Vue from 'vue'
import Setaria, { util } from 'setaria'
import 'babel-polyfill'
import Index from './Index.vue'
import message from './message.json'
import store from './store'
import zh from '../lang/zh'
import en from '../lang/en'

Vue.config.devtools = process.env.NODE_ENV === 'development'

const errorHandler = (error, type, origin) => {
  const config = error.detail && error.detail.config || {}
  if (config.isShowError !== false) {
    Setaria.getStore().commit('set_error', {
      code: error.errorCode,
      message: error.errorMessage,
      requestId: error.requestId
    })
  }
}

const sdk = new Setaria({
  errorHandler,
  http: {
    defaults: {
      timeout: 60000,
      xsrfHeaderName: 'x-csrf-token',
      transformResponse: [
        function (data, response) {
          let res = data
          // 处理JSON类型数据
          if (response['content-type'] &&
            response['content-type'].indexOf('application/json') !== -1) {
            try {
              // arraybuffer的场合
              if (typeof res !== 'string' && typeof data.byteLength === 'number') {
                res = Buffer.from(res).toString('utf8')
              }
              res = JSON.parse(res) || {}
              if (res.code !== '00000' && util.lang.isNotEmpty(res.code)) {
                res.success = false
              } else {
                res.success = true
              }
            } catch (err) {
              console.error(err)
            }
          }
          return res
        }
      ]
    },
    typicode: {
      baseURL: 'https://jsonplaceholder.typicode.com/'
    },
    biz: {
      baseURL: '/api/biz',
      showLoading: true,
      interceptor: {
        request: [
          [
            function testCustomInterceptor(config) {
              console.log('testCustomInterceptor request', config)
              config.url = config.url + '?foo=bar'
              return config
            }
          ]
        ],
        response: [
          [
            function testCustomInterceptor(response) {
              console.log('testCustomInterceptor response', response)
              return response
            }
          ]
        ]
      }
    }
  },
  message,
  store,
  i18n: {
    basePath: '/examples/lang/',
    locale: 'zh', // 设置语言环境
    fallbackLocale: 'zh',
    messages: {
      zh: zh,
      en: en
    } // 设置语言环境信息
  }
})

Vue.use(Setaria)

new Vue({
  el: '#app',
  sdk,
  render: h => h(Index)
})
