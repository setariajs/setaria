<template>
  <div>
    Index
    <router-link to="/a">Go to PageA</router-link>
    <input type="button" @click="forwardTo('PageB')" value="Go to PageB">
  </div>
</template>
<script>
  export default {
    methods: {
      forwardTo (val) {
        this.$router.forwardTo(val)
      }
    }
  }
</script>
