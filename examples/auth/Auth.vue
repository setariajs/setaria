<template>
  <div>
    <ul>
      Store同步
      <li>
        设置Store值
      </li>
      <li>
        <input v-model="storeValue">
      </li>
      <li>
        <input type="button" @click="doSetStore" value="设置">
      </li>
    </ul>
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
  import { store, storeTypes } from 'setaria'

  export default {
    data () {
      return {
        storeValue: '',
        token: ''
      }
    },
    created () {
    },
    methods: {
      doSetStore () {
        store.commit('module1/set_str', this.storeValue)
      },
      doSetToken () {
        store.commit(storeTypes.SET_TOKEN, this.token)
      }
    }
  }
</script>
