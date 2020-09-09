<template>
  <div>
    <ul>
      <li>
        a: {{ a }}
      </li>
      <li>
        b: {{ b }}
      </li>
      <li>
        c: {{ c }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'globalQueryComplexParamTestPage',
  props: {
    a: Object,
    b: Number,
    c: Array
  },
  created () {
    console.log(this.$route, this.b)
  }
}
</script>
