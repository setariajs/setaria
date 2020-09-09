import 'babel-polyfill'
import Vue from 'vue'
import Setaria from 'setaria'
import App from './App.vue'
import routes from './routes'

const sdk = new Setaria({
  http: {
    defaults: {},
    sys: {}
  },
  routes,
  moduleUrlRules: {
    '/router/c/': [
      {
        label: '测试',
        value: 'test'
      },
      {
        label: 'C页面',
        value: 'c'
      }
    ]
  }
})

Vue.use(Setaria)
new Vue({
  el: '#app',
  sdk,
  render: h => h(App)
})
