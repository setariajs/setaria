import Vue from 'vue'
import Setaria from 'setaria'
import Index from './Index.vue'
import message from './message.json'
import store from './store'

const setaria = new Setaria({
  http: {
    defaults: {
      timeout: 60000
    },
    heweather: {
      baseURL: 'https://free-api.heweather.com/s6/weather/'
    },
    typicode: {
      baseURL: 'https://jsonplaceholder.typicode.com/'
    }
  },
  message,
  store
})

Vue.use(Setaria)

new Vue({
  el: '#app',
  setaria,
  render: h => h(Index)
})
