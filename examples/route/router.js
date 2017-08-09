import Index from './Index.vue'
import PageA from './PageA.vue'
import PageB from './PageB.vue'

export default {
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/a',
      name: 'PageA',
      component: PageA
    },
    {
      path: '/b',
      name: 'PageB',
      component: PageB
    }
  ]
}
