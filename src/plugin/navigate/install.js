import VueRouter from 'vue-router'

export function install (Vue) {
  if (install.installed) {
    return
  }
  install.installed = true
  VueRouter.install(Vue)
  Vue.mixin({
    mounted () {
      if (this.$store) {
        this.$store.commit('common/direction', '')
      }
    }
  })
}
