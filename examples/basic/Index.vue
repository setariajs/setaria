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
      Http Restful服务调用测试<br/>
      1.Setaria.api.defaults或者$api为axios默认对象<br/>
      2.在config文件内定义的服务(如下面的下载服务等)，已经默认增加了相关的interceptor用于处理返回值
      <li>
        状态： {{ isLoading ? '加载中' : '' }}
      </li>
      <li>
        自定义内部服务调用
      </li>
      <li>
        <input type="button" @click="handlerCallBizApi" value="调用内部自定义服务"/>
      </li>
      <li>
        自定义内部下载文件服务(POST)
      </li>
      <li>
        <input type="button" @click="handleFileDownloadByPost('excel')" value="下载Excel"/>
        <input type="button" @click="handleFileDownloadByPost('pdf')" value="下载Pdf"/>
        <input type="button" @click="handleFileDownloadByPost('txt')" value="下载Text"/>
      </li>
      <li>
        外部服务调用
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
        <span class="label">Root foo: {{ storeFoo }}</span>
        <input/>
      </li>
      <li>
        <span class="label">Root/module1 foo: {{ storeModule1Foo }}</span>
      </li>
      <li>
        [{{ module1_1FooDispatchFlag ? '执行中...' : '待机' }}]
        &nbsp;
        <span class="label">Root/module1/module1-1 Foo: {{ storeModuleChild1Foo }}</span>
      </li>
      <li>
        <span class="label">Root/module2 foo: {{ storeModule2Foo }}</span>
      </li>
      <li>
        <input type="button" @click="handleSetStoreValue" value="设置Store的值"/>
      </li>
    </ul>
    <ul>
      异常处理
      <li>
        普通异常信息：id: {{ exception.id }}, message: {{ exception.message }}, requestId: {{ exception.requestId }}
      </li>
      <li>
        {{ lastestError }}
      </li>
      <li>
        <input type="button" @click="handleThrowRuntimeException" value="抛出执行期未捕获的JavaScript异常信息">
      </li>
      <li>
        <input type="button" @click="handleThrowException" value="抛出ApplicationError前端业务异常信息">
      </li>
      <li>
        <input type="button" @click="handleThrowPromiseExceptionByCallHttp" value="[服务]调用HTTP抛出Promise异常信息">
      </li>
      <li>
        <input type="button" @click="handleBusinessException" value="[服务]调用服务返回404异常">
      </li>
      <li>
        <input type="button" @click="handleDownloadBusinessException" value="[服务]下载服务返回业务异常">
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
import Setaria, { ApplicationError, Message, constants } from 'setaria'

export default {
  data () {
    // const store = this.$store
    return {
      messageTest: {
        messageId: '',
        message: ''
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
        // form: store.state.form,
        // module1Foo: store.getters['module1/get_foo']
      }
    }
  },
  computed: {
    storeFoo () {
      return this.$store.state.form.foo
    },
    storeModule2Foo () {
      return this.$store.getters['module2/get_foo']
    },
    storeModule1Foo () {
      return this.$store.getters['module1/get_foo']
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
    },
    lastestError () {
      return this.$store.getters[constants.STORE_KEY.GET_LASTEST_ERROR]
    }
  },
  created () {
    Setaria.config.errorHanlder = (error, type, origin) => {
      const config = error.detail && error.detail.config || {}
      if (config.isShowError !== false) {
        this.exception = {
          id: error.id,
          message: error.noIdMessage,
          requestId: error.requestId
        }
      }
    }
    this.handleThrowRuntimeException()
  },
  methods: {
    async handlerCallBizApi () {
      const res = await this.$api.biz.get('user')
      const { data } = res.data
      alert(`返回数据：${JSON.stringify(data)}`)
    },
    handleFileDownloadByPost (fileType) {
      this.$api.biz.post(`${fileType}-download`, {}, {
        responseType: 'arraybuffer'
      })
    },
    handleGetMessage () {
      this.messageTest.message = new Message(this.messageTest.messageId)
    },
    handleGetMultiWeather () {
      const defaultHttp = this.$api.defaults
      const weatherPromise = defaultHttp.get('/heweather/s6/weather/forecast?location=dalian&key=fb30dfca36fe4d0a92bb935fb2fedb33')
      const airPromise = defaultHttp.get('/heweather/s6/air/now?location=dalian&key=fb30dfca36fe4d0a92bb935fb2fedb33')
      defaultHttp.all([weatherPromise, airPromise])
        .then(defaultHttp.spread((weather, air) => {
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
      Object.prototype.findIndex()
    },
    handleThrowException () {
      throw new ApplicationError('MCM006E')
    },
    handleThrowPromiseExceptionByCallHttp () {
      this.$api.biz.post('business-error', {})
    },
    handleBusinessException () {
      this.$api.typicode.get('standard/business-exception', {})
    },
    handleDownloadBusinessException () {
      this.$api.biz.post('download-business-error', {}, {
        responseType: 'arraybuffer'
      })
    }
  }
}
</script>
 