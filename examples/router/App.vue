<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'App',
  created() {
    console.log('App Created')
  },
  beforeMount() {
    console.log('App beforeMount')
  },
  mounted() {
    console.log('App mounted')
  }
}
</script>