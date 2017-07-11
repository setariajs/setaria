<template>
  <one-popup
    class="straw-message straw-message-error"
    :class="[customClass]"
    v-model="visible"
    position="top"
    :modal="false">
    <p>{{ message }}</p>
  </one-popup>
</template>
<style>
  .straw-message {
    width: 100%;
    text-align: center;
    opacity: 0.8;
  }
  .straw-message-error {
    background-color: crimson;
    color: white;
  }
</style>
<script>
  export default {
    name: 'OneErrorMessage',
    props: {
      message: String,
      customClass: String,
      duration: {
        type: Number,
        default: 3000,
      },
      visible: {
        type: Boolean,
        default: false,
      },
    },
    watch: {
      visible: {
        immediate: true,
        handler(val) {
          if (val && this.duration !== 0) {
            setTimeout(() => {
              this.$emit('update:visible', false);
            }, this.duration);
          }
        },
      },
    },
  };
</script>
