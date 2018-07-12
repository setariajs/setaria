<template>
  <div>
    PageB
  </div>
</template>
<script>
  export default {
    created () {
      console.log('B Created')
    },
    beforeMount () {
      console.log('B beforeMount')
    },
    mounted () {
      console.log('B mounted')
    },
    destroyed () {
      console.log('B Destroyed')
    },
    beforeRouteEnter (to, from, next) {
      console.log('B beforeRouteEnter')
      next()
    },
    beforeRouteUpdate (to, from, next) {
      console.log('B beforeRouteUpdate')
      next()
    },
    beforeRouteLeave (to, from, next) {
      console.log('B beforeRouteLeave')
      next()
    }
  }
</script>
