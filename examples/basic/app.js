import Vue from 'vue'
import Setaria, { util } from 'setaria'
import 'babel-polyfill'
import Index from './Index.vue'
import message from './message.json'
import store from './store'

Vue.config.devtools = process.env.NODE_ENV === 'development'

const sdk = new Setaria({
  http: {
    defaults: {
      timeout: 60000,
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
      baseURL: '/api/biz'
    }
  },
  message,
  store
})

Vue.use(Setaria)

new Vue({
  el: '#app',
  sdk,
  render: h => h(Index)
})
