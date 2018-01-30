import Vue from 'vue'
import Setaria from 'setaria'
import Base from './Base.vue'

// 手动加载消息文件
Setaria.config.message = require('./message.json')

new Vue({
  el: '#app',
  store: Setaria.plugin.store,
  render: h => h(Base)
})
