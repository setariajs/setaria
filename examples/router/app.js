import 'babel-polyfill'
// import Vue from 'vue'
import Setaria from 'setaria'
import App from './App.vue'
import routes from './routes'
import LoadingComponent from './Loading.vue'
import ErrorComponent from './Error.vue'

const entry = {
  el: '#app',
  render: h => h(App)
}

const instance = new Setaria({
  entry,
  getInitialState ({ http }) {
    return new Promise((resolve, reject) => {
      http.biz.get('user', { showLoading: true })
        .then((res) => {
          const { data } = res.data
          resolve({ user: data })
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  loading: LoadingComponent,
  error: ErrorComponent,
  http: {
    defaults: {},
    biz: {
      baseURL: '/api/biz'
    }
  },
  routes,
  moduleUrlRules: {
    '/router/c/': [
      {
        label: '测试',
        value: 'test'
      },
      {
        label: 'C页面',
        value: 'c'
      }
    ]
  }
})

console.log('instance', Setaria)

// 使用原始方式初始化Vue根组件
// sdk为上面new Setaria后获得的实例
// entry.sdk = sdk
// Vue.use(Setaria)
// new Vue(entry)
