<template>
  <div>
    加载时出现错误
    <div class="error-message">
      {{ error }}
    </div>
  </div>
</template>
<script>
import { constants, util } from 'setaria'

export default {
  computed: {
    error() {
      const initialState = this.$store.getters[constants.STORE_KEY.GET_INITIAL_STATE]
      return util.pathOr('', ['error', 'errorMessage'], initialState)
    }
  }
}
</script>
<style scoped>
.error-message {
  color: red;
}
</style>