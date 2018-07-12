import Index from './Index.vue'
import PageA from './PageA.vue'
import PageB from './PageB.vue'
import PageC from './PageC.vue'

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
      beforeEnter (to, from, next) {
        console.log('B beforeEnter')
        next()
      },
      component: PageB
    },
    {
      path: '/c/:id',
      name: 'PageC',
      beforeEnter (to, from, next) {
        console.log('C beforeEnter')
        next()
      },
      component: PageC
    }
  ]
}
