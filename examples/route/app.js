import Vue from 'vue'
import Setaria from 'setaria'
import router from './router'
import App from './App.vue'

Vue.use(Setaria.plugin.Navigate)
const navi = new Setaria.plugin.Navigate(router)
navi.beforeEach((to, from, next) => {
  console.log('beforeEach')
  next()
})
navi.afterEach((route) => {
  console.log('afterEach')
})

new Vue({
  el: '#app',
  store: Setaria.plugin.store,
  router: navi,
  render: h => h(App)
})
