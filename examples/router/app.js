import Vue from 'vue'
import Setaria from 'setaria'
import App from './App.vue'
import routes from './routes'

const setaria = new Setaria({
  routes
})

Vue.use(Setaria)

new Vue({
  el: '#app',
  setaria,
  render: h => h(App)
})
