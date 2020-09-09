import Index from './Index.vue'
import PageA from './PageA.vue'
import PageB from './PageB.vue'
import PageC from './PageC.vue'
import PageC1 from './PageC1.vue'
import PageC2 from './PageC2.vue'
import GlobalQueryComplexParamTestPage from './GlobalQueryComplexParamTestPage.vue'

export default {
  mode: 'history',
  base: '/router',
  routes: [
    {
      path: '/',
      name: 'Index',
      meta: { title: '首页', breadCrumb: false },
      component: Index,
      children: [
        {
          path: '',
          name: 'pageA',
          meta: { title: 'A' },
          component: PageA
        },
        {
          path: 'b',
          name: 'pageB',
          meta: { title: 'B' },
          beforeEnter (to, from, next) {
            console.log('B beforeEnter')
            next()
          },
          component: PageB
        },
        {
          path: 'c',
          name: 'pageC',
          meta: { title: 'C' },
          component: PageC,
          props: true,
          children: [
            {
              path: 'c1/:id',
              name: 'pageC1',
              meta: { title: 'C1' },
              beforeEnter (to, from, next) {
                console.log('C1 beforeEnter')
                next()
              },
              component: PageC1,
              props: (route) => {
                return {
                  foo: route.query.foo
                }
              }
            },
            {
              path: 'c2',
              name: 'pageC2',
              meta: { title: 'C2' },
              beforeEnter (to, from, next) {
                console.log('C2 beforeEnter')
                next()
              },
              component: PageC2
            }
          ]
        },
        {
          path: 'global-query-complex-param-test-page',
          name: 'globalQueryComplexParamTestPage',
          component: GlobalQueryComplexParamTestPage,
          props: (route) => {
            const query = route.query
            if (query) {
              let b = query.b
              if (b && !isNaN(parseInt(b, 10))) {
                b = parseInt(b, 10)
              }
              return {
                ...query,
                b
              }
            }
          }
        },
        {
          path: '*',
          component: { template: '<div>404</div>' }
        }
      ]
    }
  ]
}
