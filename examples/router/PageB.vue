<template>
  <div>
    PageB
    <input type="button" @click="onReplace" value="replace(c)">
    <input type="button" @click="onBack" value="back">
    <input type="button" @click="onGoBack" value="go(-1)">
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
    },
    methods: {
      onReplace () {
        this.$router.replace({
          name: 'pageC',
          params: {
            id: 'B'
          }
        })
      },
      onBack () {
        this.$router.back()
      },
      onGoBack () {
        this.$router.go(-1)
      }
    }
  }
</script>
