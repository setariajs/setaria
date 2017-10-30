<template>
  <div>
    <ul>
      消息文件测试
      <li>
        取得的消息内容：{{ msg }}
      </li>
      <li>
        <input type="button" @click="doGetMessage" value="取得消息定义">
      </li>
    </ul>
    <ul>
      公共函数调用测试
      <li>
        当前时间: {{ now }}
      </li>
      <li>
        <input type="button" @click="doShowTime" value="取得当前时间(util.getNow())">
      </li>
    </ul>
    <ul>
      Http Restful服务调用测试
      <li>
        状态： {{ loadingState }}
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
        <input type="button" @click="doGetWeather" value="取得天气信息">
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
        <input type="button" @click="doGetWeatherFull" value="取得天气信息">
      </li>
    </ul>
    <ul>
      异常处理
      <li>
        普通异常信息：id: {{ exception.id }}, message: {{ exception.message }}
      </li>
      <li>
        <input type="button" @click="doThrowException" value="抛出异常信息">
      </li>
      <li>
        <input type="button" @click="doThrowPromiseException" value="抛出Promise异常信息">
      </li>
    </ul>
    <ul>
      Storage
      <li>
        <input type="text" v-model="storageValue">
      </li>
      <li>
        {{ storageType }}: {{ dispStorageValue }}
      </li>
      <li>
        <input type="radio" value="local" v-model="storageType">Local
        <input type="radio" value="session" v-model="storageType">Session
        <input type="button" @click="doSaveToLocalStorage(storageValue)" :value="storageButtonLabel">
      </li>
    </ul>
  </div>
</template>
<style scoped>
  .forecast {
    color: lightseagreen
  }
</style>
<script>
  import Setaria, { ApplicationError, Http, Message, ServiceError, Storage, util } from 'setaria'

  const STORAGE_KEY = 'storageKey'

  export default {
    name: 'Base',
    data () {
      return {
        now: null,
        msg: '',
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
        storageValue: '',
        dispStorageValue: '',
        storageType: 'local'
      }
    },
    watch: {
      storageType () {
        this.storageValue = this.getStorageValue()
      }
    },
    computed: {
      storageButtonLabel () {
        return `存储信息至${this.storageType}`
      },
      loadingState () {
        return util.get(this.$store, 'getters', {})['common/isLoading'] ? '加载中' : ''
      }
    },
    created () {
      Setaria.config.errorHanlder = ({ id, noIdMessage }) => {
        this.exception = {
          id,
          message: noIdMessage
        }
      }
      this.storageValue = this.getStorageValue()
      throw new ApplicationError('MCM005E', [this.$options.name])
    },
    methods: {
      doGetMessage () {
        this.msg = JSON.stringify(new Message('MCM004W'))
      },
      doShowTime () {
        this.now = util.getNow()
      },
      doGetWeather () {
        Http.get('https://free-api.heweather.com/s6/weather/forecast?location=dalian&key=fb30dfca36fe4d0a92bb935fb2fedb33').then((res) => {
          const w = res.data.HeWeather6[0]
          const forecast = w.daily_forecast[0]
          this.weather.location = w.basic.location
          this.weather.condDay = forecast.cond_txt_d
          this.weather.condNight = forecast.cond_txt_n
          this.weather.tmpMin = forecast.tmp_min
          this.weather.tmpMax = forecast.tmp_max
        })
      },
      doGetWeatherFull () {
        const weatherPromise = Http.get('https://free-api.heweather.com/s6/weather/forecast?location=dalian&key=fb30dfca36fe4d0a92bb935fb2fedb33');
        const airPromise = Http.get('https://free-api.heweather.com/s6/air/now?location=dalian&key=fb30dfca36fe4d0a92bb935fb2fedb33')
        Http.all([weatherPromise, airPromise])
          .then(Http.spread((weather, air) => {
            const w = weather.data.HeWeather6[0]
            const forecast = w.daily_forecast[0]
            this.fullWeather.location = w.basic.location
            this.fullWeather.condDay = forecast.cond_txt_d
            this.fullWeather.condNight = forecast.cond_txt_n
            this.fullWeather.tmpMin = forecast.tmp_min
            this.fullWeather.tmpMax = forecast.tmp_max
            const a = air.data.HeWeather6[0]
            const airCity = a.air_now.air_city
            this.fullWeather.aqi = airCity.aqi
            this.fullWeather.main = util.isEmpty(airCity.main) ? '无' : airCity.main
            this.fullWeather.qlty = airCity.qlty
          }))
          .catch((err) => {
            console.log(err)
          })
      },
      doThrowException () {
        throw new ApplicationError('MCM006E')
      },
      doThrowPromiseException () {
        Http.get('/api/weather').then((res) => {
          throw new ServiceError('MCM007E')
        })
      },
      doSaveToLocalStorage (val) {
        if (this.storageType === 'local') {
          Storage.setLocalItem(STORAGE_KEY, val)
        } else {
          Storage.setSessionItem(STORAGE_KEY, val)
        }
        this.getStorageValue()
      },
      getStorageValue () {
        let ret = ''
        if (this.storageType === 'local') {
          this.dispStorageValue = Storage.getLocalItem(STORAGE_KEY)
        } else {
          this.dispStorageValue = Storage.getSessionItem(STORAGE_KEY)
        }
        ret = this.dispStorageValue
        return ret
      }
    }
  }
</script>
