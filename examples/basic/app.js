import Vue from 'vue'
import Setaria from 'setaria'
import 'babel-polyfill'
import Index from './Index.vue'
import message from './message.json'
import store from './store'

Vue.config.devtools = process.env.NODE_ENV === 'development'

const sdk = new Setaria({
  http: {
    defaults: {
      timeout: 60000
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
