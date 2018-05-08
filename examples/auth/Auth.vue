<template>
  <div>
    <ul>
      鉴权
      <li>
        设置Token值
      </li>
      <li>
        <input v-model="token">
      </li>
      <li>
        <input type="button" @click="doSetToken" value="设置Token">
      </li>
    </ul>
  </div>
</template>
<script>
  import Setaria, { storeTypes } from 'setaria'

  export default {
    data () {
      return {
        token: ''
      }
    },
    created () {
      Setaria.plugin.store.commit('module1/set_str', 'abcde')
      Setaria.plugin.store.commit('module2/set_num', 12345)
    },
    methods: {
      doSetToken () {
        Setaria.plugin.store.commit(storeTypes.SET_TOKEN, this.token)
      }
    }
  }
</script>
