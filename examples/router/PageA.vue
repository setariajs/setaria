<template>
  <div>
    PageA
    <input type="button" @click="$router.push({name:'PageB'})" value="Go to PageB">
    <input type="button" @click="$router.push({name:'PageC', params:{ 'id':2 }})" value="Go to PageC">
  </div>
</template>
<script>
  export default {
    created () {
      console.log('A Created')
    },
    beforeDestroy () {
      console.log('A beforeDestroy')
    },
    destroyed () {
      console.log('A Destroyed')
    },
    beforeRouteEnter (to, from, next) {
      console.log('A beforeRouteEnter')
      next()
    },
    beforeRouteUpdate (to, from, next) {
      console.log('A beforeRouteUpdate')
      next()
    },
    beforeRouteLeave (to, from, next) {
      console.log('A beforeRouteLeave')
      next()
    }
  }
</script>
