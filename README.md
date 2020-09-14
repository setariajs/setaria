# Setaria

> FrontEnd SPA Enterprise Framework

## 功能

> Setaria框架主要用于解决进行应用开发时经常面对的公共场景。

* 提供了错误处理的统一接口用于解决由浏览器，第三方依赖和Promise抛出的异常
* 提供了统一的Restful服务调用接口
* 可通过Setaria.config.js配置文件对应用开发中的消息，路由，状态等模块进行配置和管理
* 提供了中间件(middleware)配置
* 可使用History接口判断页面的跳转方向（前进/后退）

## 开发所需软件

1. NodeJS

> 用于在本地进行前端的开发与调试。

  [安装包下载地址](https://nodejs.org/zh-cn/download/)
  [安装说明](http://www.runoob.com/nodejs/nodejs-install-setup.html)

``` bash
1.使用国内镜像
npm config set registry https://registry.npm.taobao.org
// 配置后可通过下面方式来验证是否成功
npm config get registry
```

2. Yarn

> 用于安装项目所需的第三方依赖包

  [安装包下载地址和安装说明](https://yarnpkg.com/zh-Hans/docs/install/)

3. Git

> 版本管理工具。用于下载项目的代码和在开发时进行代码和文档的版本管理。

  [安装说明](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git)

## 安装步骤

``` bash
# 下载工程到本地
git clone https://github.com/bluejfox/setaria.git
# 进入工程目录
cd setaria
# 安装项目依赖
yarn install
```

## 浏览器支持

支持各种主流浏览器(Chrome, Firefox, Safari)和Internet Explorer 9+.

## 依赖包列表

* [vue](https://github.com/vuejs/vue)
* [axios](https://github.com/mzabriskie/axios)
* [lodash](https://lodash.com/)
* [moment](https://momentjs.com/)
* [vue-router](https://github.com/vuejs/vue-router)
* [vuex](https://github.com/vuejs/vuex)

## 开发前需要掌握的知识

* [ES6](http://es6.ruanyifeng.com/)

## 生态圈

* [Setaria-UI](https://github.com/bluejfox/setaria-ui) 桌面端组件库

## 特色功能

### 1. 初始化数据设置

> 约定一个地方生产和消费初始化数据

#### 1.1 启用方式

```javascript
// 在app.js中将传入new Vue构造函数中的组件配置信息放置到 `Setaria.config.entry` 中
new Setaria({
  // Vue入口组件配置信息
  entry： {
    // 原new Vue构造函数参数
    el: '#app',
    // 原new Vue构造函数参数
    render: h => h(App),
    // 定义getInitialState函数，必须返回Promise对象
    getInitialState ({ http }) {
      return new Promise((resolve, reject) => {
        http.biz.get('user', { showLoading: true })
          .then((res) => {
            const { data } = res.data
            // 返回值会由Setaria存入Vuex中，请根据实际情况构建适合的initialState结构
            resolve({ user: data })
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  },
  loading: LoadingComponent,
  error: ErrorComponent,
  http: {
    defaults: {},
    biz: {
    }
  },
  routes
})

```

#### 1.2 运行时配置

`getInitialState`函数会在整个应用最开始执行，返回值会作为全局共享的数据。执行成功后框架会初始化根Vue实例，之后在Vue实例中可以通过 `this.$store.getters[constants.STORE_KEY.GET_INITIAL_STATE]` 直接获取到这份数据。

#### 1.3 API

##### 获取返回值

```javascript
computed: {
  initialState() {
    const { data, error } = this.$store.getters[constants.STORE_KEY.GET_INITIAL_STATE];
    return data;
  }
},
```

##### data

* Type: any
* Default: null

运行时配置中，`getInitialState` 的返回值

##### error

* Type: Error
* Default: null

当运行时配置中，`getInitialState` throw Error 时，会将错误储存在 `error` 中。

##### 手动设置返回值

通过Vuex使用`constants.STORE_KEY.SET_INITIAL_STATE` mutation将数据手动保存至全局Vuex Module中

## 公共模块

- [ ] 鉴权
- [X] 消息处理
- [X] 服务调用
- [X] 异常处理
- [X] 路由处理
- [x] 数据存储管理
- [ ] 用户状态管理

## License

MIT
