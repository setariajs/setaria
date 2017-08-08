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
  </div>
</template>
<script>
  import Setaria, { ApplicationError, Http, Message, util } from 'setaria'

  export default {
    data () {
      return {
        now: null,
        msg: '',
        weather: '',
        exception: {}
      }
    },
    created () {
      Setaria.config.errorHanlder = (err) => {
        this.exception = err
      }
      throw new ApplicationError('MAM003E', [100])
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
      }
    }
  }
</script>
