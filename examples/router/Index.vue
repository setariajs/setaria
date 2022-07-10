<template>
  <div>
    <div>
      <input type="button" value="close" @click="onClose">
      <input type="button" :value="`${showIframe ? 'remove' : 'add'} iframe`" @click="toggleIFrame">
    </div>
    <router-view></router-view>
    <template v-if="!isIFrame">
      <iframe id="a" src="/router" class="iframe-class" :key="aiframeKey"></iframe>
      <iframe id="b" src="/router" v-if="showIframe" class="iframe-class" :key="biframeKey"></iframe>
    </template>
  </div>
</template>
<script>
  import Setaria, { constants, util } from 'setaria'

  export default {
    data () {
      return {
        showIframe: false,
        aiframeKey: 'a123',
        biframeKey: 'b456'
      }
    },
    mounted () {
//      console.log( this.$router.generateModuleParams({ url:'1111',query: {
// a:1, b:'2',c:'3c',d:{d1:'dd1',d2:'dd2'}

//       } }))
      console.log(util.isIE)
      // setTimeout(() => {
      //   Setaria.vm.$destroy()
      // }, 3000)
    },
    computed: {
      isIFrame () {
        return window !== window.top
      }
    },
    methods: {
      push () {
        this.$router.push({
          name: 'pageB'
        })
      },
      onClose () {
        this.$router.close()
      },
      toggleIFrame () {
        this.showIframe = !this.showIframe
        if (this.showIframe === false) {
          window.history.go(-1)
        }
      }
    }
  }
</script>
<style scoped>
.iframe-class {
  width: 500px;
  height: 500px;
}
</style>
