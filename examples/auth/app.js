import Vue from 'vue'
import Setaria from 'setaria'
import Auth from './Auth.vue'
import './store'

Setaria.config.storeSync['module1'] = 'session'
Setaria.config.storeSync['module2'] = 'local'

Setaria.config.auth.storageMode = 'session'

new Vue({
  el: '#app',
  store: Setaria.plugin.store,
  render: h => h(Auth)
})
