import message from './message.json'

export default {
  router: {},
  message,
  http: {
    defaults: {
      timeout: 60000
    },
    heweather: {
      baseURL: 'https://free-api.heweather.com/s6/weather/'
    },
    typicode: {
      baseURL: 'https://jsonplaceholder.typicode.com/'
    }
  }
}
