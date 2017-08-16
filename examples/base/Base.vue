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
        天气信息：{{ weather }}
      </li>
      <li>
        <input type="button" @click="doGetWeather" value="取得天气信息">
      </li>
    </ul>
    <ul>
      异常处理
      <li>
        异常信息：id: {{ exception.id }}, message: {{ exception.message }}
      </li>
      <li>
        <input type="button" @click="doThrowException" value="抛出异常信息">
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
<script>
  import Setaria, { ApplicationError, Http, Message, Storage, util } from 'setaria'

  const STORAGE_KEY = 'storageKey'

  export default {
    data () {
      return {
        now: null,
        msg: '',
        weather: '',
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
      }
    },
    created () {
      Setaria.config.errorHanlder = (err) => {
        this.exception = err
      }
      this.storageValue = this.getStorageValue()
      throw new ApplicationError('', null, 'eee')
    },
    methods: {
      doGetMessage () {
        this.msg = JSON.stringify(new Message('MCM004W'))
      },
      doShowTime () {
        this.now = util.getNow()
      },
      doGetWeather () {
        Http.get('/api/weather').then((res) => {
          this.weather = JSON.stringify(res.data)
        })
      },
      doThrowException () {
        throw new ApplicationError('MAM008E')
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
