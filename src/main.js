// import applyMixin from './mixin'

export function install (_Vue) {
}

// auto install in dist mode
if (typeof window !== 'undefined') {
  install(window.Vue)
}
