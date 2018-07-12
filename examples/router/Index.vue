<template>
  <div>
    Index
    <router-link to="/a">Go to PageA</router-link>
    <input type="button" @click="push" value="Go to PageB">
  </div>
</template>
<script>
  export default {
    methods: {
      push () {
        this.$router.push({
          name: 'PageB'
        })
      }
    }
  }
</script>
