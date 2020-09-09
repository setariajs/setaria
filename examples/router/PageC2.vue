<template>
  <div>
    PageC
    <input type="button" @click="$router.push({name:'pageB'})" value="Go to PageB">
    <input type="button" @click="onGoBack" value="go(-1)">
  </div>
</template>
<script>
  export default {
    created () {
      console.log('C Created')
    },
    beforeDestroy () {
      console.log('C beforeDestroy')
    },
    destroyed () {
      console.log('C Destroyed')
    },
    beforeRouteEnter (to, from, next) {
      console.log('C beforeRouteEnter')
      next()
    },
    beforeRouteUpdate (to, from, next) {
      console.log('C beforeRouteUpdate')
      next()
    },
    beforeRouteLeave (to, from, next) {
      console.log('C beforeRouteLeave')
      next()
    },
    methods: {
      onGoBack () {
        this.$router.go(-1)
      }
    }
  }
</script>
