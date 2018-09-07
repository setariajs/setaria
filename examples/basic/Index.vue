<template>
  <div>
    <ul>
      消息文件测试
      <li>
        <input type="text" v-model="messageTest.messageId"/>
        <input type="button" @click="handleGetMessage" value="取得消息定义"/>
      </li>
      <li>
        取得的消息内容：{{ messageTest.message }}
      </li>
    </ul>
    <ul>
      Http Restful服务调用测试
      <li>
        状态： {{ isLoading }}
      </li>
      <li>
        单一服务
      </li>
      <li>
        天气信息：城市: <span class="forecast">{{ weather.location }}</span>
        | 白天：<span class="forecast">{{ weather.condDay }}</span>
        | 夜间：<span class="forecast">{{ weather.condNight }}</span>
        | 最低气温：<span class="forecast">{{ weather.tmpMin }}℃</span>
        | 最高气温：<span class="forecast">{{ weather.tmpMax }}℃</span>
      </li>
      <li>
        <input type="button" @click="handleGetWeather" value="取得天气信息">
      </li>
      <li>
        多个服务
      </li>
      <li>
        天气信息：城市: <span class="forecast">{{ fullWeather.location }}</span>
        | 白天：<span class="forecast">{{ fullWeather.condDay }}</span>
        | 夜间：<span class="forecast">{{ fullWeather.condNight }}</span>
        | 最低气温：<span class="forecast">{{ fullWeather.tmpMin }}℃</span>
        | 最高气温：<span class="forecast">{{ fullWeather.tmpMax }}℃</span>
      </li>
      <li>
        空气信息：城市: <span class="forecast">{{ fullWeather.location }}</span>
        | 空气质量指数：<span class="forecast">{{ fullWeather.aqi }}</span>
        | 主要污染物：<span class="forecast">{{ fullWeather.main }}</span>
        | 空气质量：<span class="forecast">{{ fullWeather.qlty }}</span>
      </li>
      <li>
        <input type="button" @click="handleGetMultiWeather" value="取得天气信息">
      </li>
    </ul>
    <ul>
      Store测试
      <li>
        <span class="label">[全局Dispatch执行状态]:</span>
        {{ globalDispatchFlag ? '执行中...' : '待机' }}
      </li>
      <li>
        [{{ fooDispatchFlag ? '执行中...' : '待机' }}]
        &nbsp;
        <span class="label">Root foo:</span>
        <input v-model="store.form.foo"/>
      </li>
      <li>
        <span class="label">Root/module1 foo:</span> {{ store.module1Foo }}
      </li>
      <li>
        [{{ module1_1FooDispatchFlag ? '执行中...' : '待机' }}]
        &nbsp;
        <span class="label">Root/module1/module1-1 Foo:</span> {{ storeModuleChild1Foo }}
      </li>
      <li>
        <span class="label">Root/module2 foo:</span> {{ storeModule2Foo }}
      </li>
      <li>
        <input type="button" @click="handleSetStoreValue" value="设置Store的值"/>
      </li>
    </ul>
    <ul>
      异常处理
      <li>
        普通异常信息：id: {{ exception.id }}, message: {{ exception.message }}
      </li>
      <li>
        <input type="button" @click="handleThrowRuntimeException" value="抛出执行期未捕获的异常信息">
      </li>
      <li>
        <input type="button" @click="handleThrowException" value="抛出异常信息">
      </li>
      <li>
        <input type="button" @click="handleThrowPromiseException" value="抛出Promise异常信息">
      </li>
    </ul>
  </div>
</template>
<style>
  .forecast {
    color: lightseagreen
  }
  .highlight {
    background-color: yellow
  }
  .label {
    font-weight: 200;
  }
</style>
<script>
import Setaria, { ApplicationError, constants, Message } from 'setaria'

export default {
  data () {
    const store = this.$store
    return {
      messageTest: {
        messageId: '',
        message: ''
      },
      weather: {
        location: '',
        date: '',
        condDay: '',
        condNight: '',
        tmpMin: '',
        tmpMax: ''
      },
      fullWeather: {
        location: '',
        date: '',
        condDay: '',
        condNight: '',
        tmpMin: '',
        tmpMax: '',
        aqi: '',
        main: '',
        qlty: ''
      },
      exception: {},
      store: {
        form: store.state.form,
        module1Foo: store.getters['module1/get_foo']
      }
    }
  },
  computed: {
    storeFoo () {
      return this.$store.state.foo
    },
    storeModule2Foo () {
      return this.$store.getters['module2/get_foo']
    },
    storeModuleChild1Foo () {
      return this.$store.getters['module1/module1-1/get_foo']
    },
    isLoading () {
      return this.$store.getters[constants.STORE_KEY.GET_IS_LOADING]
    },
    fooDispatchFlag () {
      return this.$store.state.loading.actions.global_dispatch_foo
    },
    globalDispatchFlag () {
      return this.$store.getters['loading/global']
    },
    module1_1FooDispatchFlag () {
      return this.$store.state.loading.actions['module1/module1-1/dispatch_foo']
    }
  },
  created () {
    Setaria.config.errorHanlder = ({ id, noIdMessage, detail = {}}) => {
      const config = detail.config || {}
      if (config.isShowError !== false) {
        this.exception = {
          id,
          message: noIdMessage
        }
      }
    }
    this.handleThrowRuntimeException()
  },
  methods: {
    handleGetMessage () {
      this.messageTest.message = new Message(this.messageTest.messageId)
    },
    handleGetWeather () {
      const { heweather } = this.$http
      heweather.get('forecast?location=dalian&key=fb30dfca36fe4d0a92bb935fb2fedb33').then((res) => {
        const w = res.data.HeWeather6[0]
        const forecast = w.daily_forecast[0]
        this.weather.location = w.basic.location
        this.weather.condDay = forecast.cond_txt_d
        this.weather.condNight = forecast.cond_txt_n
        this.weather.tmpMin = forecast.tmp_min
        this.weather.tmpMax = forecast.tmp_max
      })
    },
    handleGetMultiWeather () {
      const { heweather } = this.$http
      const weatherPromise = heweather.get('https://free-api.heweather.com/s6/weather/forecast?location=dalian&key=fb30dfca36fe4d0a92bb935fb2fedb33')
      const airPromise = heweather.get('https://free-api.heweather.com/s6/air/now?location=dalian&key=fb30dfca36fe4d0a92bb935fb2fedb33')
      heweather.all([weatherPromise, airPromise])
        .then(heweather.spread((weather, air) => {
          const w = weather.data.HeWeather6[0]
          const forecast = w.daily_forecast[0]
          this.fullWeather.location = w.basic.location
          this.fullWeather.condDay = forecast.cond_txt_d
          this.fullWeather.condNight = forecast.cond_txt_n
          this.fullWeather.tmpMin = forecast.tmp_min
          this.fullWeather.tmpMax = forecast.tmp_max
          const a = air.data.HeWeather6[0]
          const airCity = a.air_now_city
          this.fullWeather.aqi = airCity.aqi
          this.fullWeather.main = airCity.main ? '无' : airCity.main
          this.fullWeather.qlty = airCity.qlty
        }))
        .catch((err) => {
          console.log(err)
        })
    },
    handleSetStoreValue () {
      this.$store.commit('set_foo', 'foo')
      this.$store.commit('module1/set_foo', 'module1-foo')
      this.$store.commit('module1/module1-1/set_foo', 'module1-1-foo')
      this.$store.commit('module2/set_foo', 'module2-foo')
      this.$store.dispatch('module1/module1-1/dispatch_foo', 'async_module1-1-foo')
      this.$store.dispatch('global_dispatch_foo', 'global_async_foo')
    },
    handleThrowRuntimeException () {
      const obj = null
      obj.data = 1
    },
    handleThrowException () {
      throw new ApplicationError('MCM006E')
    },
    handleThrowPromiseException () {
      const { heweather } = this.$http
      heweather.get('/api/weather', null, {
        showError: false
      }).then((res) => {
        throw new ApplicationError('MCM007E')
      })
      // .catch(() => {
      //   console.log('cache error')
      //   // throw new ServiceError('MCM008E')
      // })
    }
  }
}
</script>
