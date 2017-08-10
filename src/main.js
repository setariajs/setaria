import applyMixin from './mixin'

export function install (_Vue) {
  if (Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[setaria] already installed. Vue.use(Setaria) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}

// auto install in dist mode
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}