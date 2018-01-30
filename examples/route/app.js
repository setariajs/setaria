import Vue from 'vue'
import Setaria from 'setaria'
import App from './App.vue'

// 手动加载路由设置
const routerConfig = require('./router.js')
const router = Setaria.plugin.router
router.addRoutes(routerConfig.default.routes)

new Vue({
  el: '#app',
  store: Setaria.plugin.store,
  router: Setaria.plugin.router,
  render: h => h(App)
})
