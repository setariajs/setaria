<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
import kebabCase from 'lodash.kebabcase'

export default {
  name: 'App',
  created() {
    console.log('App Created')
    console.log(kebabCase('Foo Bar'))
  },
  beforeMount() {
    console.log('App beforeMount')
  },
  mounted() {
    console.log('App mounted')
  }
}
</script>