<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
import { util } from 'setaria'

export default {
  name: 'App',
  created() {
    console.log('App Created')
    console.log(util.query.resolveQuery(window.location.search))
  },
  beforeMount() {
    console.log('App beforeMount')
  },
  mounted() {
    console.log('App mounted')
  }
}
</script>