# Setaria 依赖功能说明

> 本文档详细说明了 Setaria 框架中各个依赖包的功能和用途

## 目录

- [核心依赖 (Core Dependencies)](#核心依赖-core-dependencies)
  - [axios - HTTP客户端](#axios-021x)
  - [ramda - 函数式编程工具](#ramda-0250)
  - [lodash.camelcase - 驼峰命名转换](#lodashcamelcase-430)
  - [lodash.kebabcase - 短横线命名转换](#lodashkebabcase-411)
- [对等依赖 (Peer Dependencies)](#对等依赖-peer-dependencies)
  - [vue - 核心框架](#vue-2521)
  - [vue-router - 路由管理](#vue-router-22x)
  - [vuex - 状态管理](#vuex-231)
  - [vue-i18n - 国际化](#vue-i18n-8267)
- [开发依赖说明](#开发依赖的功能说明)
- [框架特色功能](#框架特色功能)
- [使用示例](#使用示例)

## 核心依赖 (Core Dependencies)

### axios (^0.21.x)
**功能**: HTTP客户端库，用于处理前端与后端API的通信

**在Setaria中的用途**:
- 提供统一的HTTP服务调用接口
- 支持请求和响应拦截器
- 自动处理加载状态管理
- 统一错误处理和业务异常处理
- 支持XSRF防护
- 支持文件下载功能

**核心功能**:
```javascript
// HTTP配置示例
http: {
  defaults: {
    // 默认配置
    timeout: 30000,
    showLoading: true
  },
  biz: {
    // 业务模块配置
    baseURL: 'http://api.example.com',
    showLoading: false
  }
}
```

**拦截器功能**:

**请求拦截器**:
- `addLoading`: 请求时自动显示加载状态
- `addXsrf`: 自动添加XSRF令牌防护
- `appendCustomHeader`: 添加自定义请求头

**响应拦截器**:
- `fileDownload`: 处理文件下载响应
- `subLoading`: 响应后移除加载状态
- `errorHandler`: 统一HTTP错误处理(4xx, 5xx状态码)
- `businessErrorHandler`: 业务异常处理(success: false)
- `commonHandler`: 通用响应处理(设置traceId, oddNumber等)

**支持的HTTP状态码处理**:
- `400`: Bad Request
- `401`: Unauthorized  
- `403`: Forbidden
- `404`: Not Found
- `405`: Method Not Allowed
- `502`: Bad Gateway
- `503`: Service Unavailable
- `504`: Gateway Timeout

### ramda (^0.25.0)
**功能**: 函数式编程工具库

**在Setaria中的用途**:
- 提供函数式编程工具
- 对象和数组操作
- 数据转换和处理

**主要使用的功能**:
```javascript
// 对象合并
merge(obj1, obj2)
mergeDeepRight(obj1, obj2)

// 路径访问
pathOr(defaultValue, path, obj)
propOr(defaultValue, key, obj)

// 数组操作
findIndex(fn)(list)

// 数据验证
isEmpty(val)
isNotEmpty(val)

// 字符串操作
trim(val)
startsWith(char, val)
endsWith(char, val)

// 数据克隆
clone(val)
```

### lodash.camelcase (^4.3.0)
**功能**: 字符串转换为驼峰命名

**在Setaria中的用途**:
```javascript
// 转换成驼峰命名
camelCase('hello-world') // => 'helloWorld'
camelCase('hello_world') // => 'helloWorld'
```

### lodash.kebabcase (^4.1.1)
**功能**: 字符串转换为短横线命名

**在Setaria中的用途**:
```javascript
// 转换成kebab命名
kebabCase('helloWorld') // => 'hello-world'
kebabCase('HelloWorld') // => 'hello-world'
```

## 对等依赖 (Peer Dependencies)

### vue (2.5.21)
**功能**: 核心Vue.js框架

**在Setaria中的用途**:
- 提供组件化开发能力
- 响应式数据绑定
- 生命周期管理
- 指令系统
- 模板编译

**集成功能**:
- 统一错误处理 (`Vue.config.errorHandler`)
- 全局组件注册
- 混入(Mixin)功能
- 插件系统集成

### vue-router (^2.2.x)
**功能**: Vue.js官方路由管理器

**在Setaria中的用途**:
- 单页应用路由管理
- 页面导航控制
- 路由历史记录管理
- 页面跳转方向判断

**增强功能**:
```javascript
// 路由历史管理
router.back() // 覆写的back函数，支持历史记录
router.push() // 覆写的push函数，支持历史记录
router.replace() // 覆写的replace函数，支持历史记录

// 页面跳转方向判断
ROUTER.DIRECTION.FORWARD  // 前进
ROUTER.DIRECTION.BACK     // 后退
ROUTER.DIRECTION.REPLACE  // 替换
```

**路由守卫功能**:
- 模块间参数传递
- 用户信息同步
- 页面跟踪统计
- Query参数持久化

### vuex (^2.3.1)
**功能**: Vue.js状态管理模式

**在Setaria中的用途**:
- 全局状态管理
- 数据持久化(LocalStorage/SessionStorage)
- 加载状态管理
- 错误历史记录
- 路由历史管理

**内置状态模块**:
```javascript
state: {
  // 初始化数据
  _setaria_initial_state: { data: null, error: null },
  // 页面跳转方向
  _setaria_direction: '',
  // 加载状态计数
  _setaria_loading: 0,
  // 路由历史
  _setaria_routeHistory: {},
  // 页面跟踪历史
  _setaria_track_history: [],
  // 错误历史
  _setaria_error_history: [],
  // 页面模块列表
  _setaria_page_module_list: [],
  // 当前页面模块
  _setaria_current_page_module: [],
  // 请求ID
  _setaria_request_id: '',
  // 业务单据号
  _setaria_odd_number: '',
  // 调试请求列表
  _setaria_debug_request_list: [],
  // XSRF令牌
  _setaria_xsrf: ''
}
```

**存储同步插件**:
```javascript
// 配置示例
syncConfig: {
  '_root': 'local',        // 根模块同步到LocalStorage
  'module1/module2': 'session'  // 子模块同步到SessionStorage
}
```

### vue-i18n (^8.26.7)
**功能**: Vue.js国际化插件

**在Setaria中的用途**:
- 多语言支持
- 消息本地化
- 动态语言切换
- 错误消息国际化

**集成方式**:
- 与Setaria的消息系统集成
- 支持动态加载语言包
- 错误消息自动国际化

## 开发依赖的功能说明

### 构建工具
- **rollup**: 模块打包器，用于构建生产版本
- **babel**: JavaScript编译器，支持ES6+语法转换
- **webpack**: 开发服务器和模块打包

### 代码质量工具
- **eslint**: JavaScript代码规范检查
- **flow-bin**: 静态类型检查
- **prettier**: 代码格式化工具

### 测试工具
- **jasmine**: 单元测试框架
- **nightwatch**: 端到端测试框架

### 开发服务器
- **express**: Node.js Web服务器
- **webpack-dev-middleware**: Webpack开发中间件
- **webpack-hot-middleware**: 热重载中间件

## 框架特色功能

### 1. 统一错误处理
集成多种错误捕获机制:
- `window.onerror`: 全局JavaScript错误
- `Vue.config.errorHandler`: Vue组件错误
- `Promise onunhandledrejection`: Promise异常

**错误类型定义**:
```javascript
ERROR_THROW_TYPES = {
  'NORMAL_ERROR': 0,         // 非Vue组件的常规错误
  'PROMISE_UNREJECT_ERROR': 1, // Promise回调函数中的错误
  'VUE_ERROR': 2            // Vue组件生命周期和事件错误
}
```

**错误对象类型**:
- `ApplicationError`: 应用执行期异常
- `ServiceError`: 服务调用异常

**错误显示类型**:
- `0`: 静默处理
- `1`: message.warn
- `2`: message.error (默认)
- `4`: notification
- `9`: 错误页面

### 2. HTTP服务管理
提供完整的HTTP服务解决方案:
- 多实例支持
- 拦截器链
- 自动加载状态
- 错误处理
- 文件下载

### 3. 状态管理增强
扩展Vuex功能:
- 自动存储同步
- 路由历史管理
- 加载状态追踪
- 错误历史记录

### 4. 路由增强
扩展Vue Router功能:
- 页面跳转方向判断
- 参数持久化
- 用户状态同步
- 页面跟踪统计

### 5. 初始化数据管理
提供统一的应用初始化:
- 异步数据加载
- 错误处理
- 加载状态管理
- 数据刷新机制

## 使用示例

### 基本配置
```javascript
import Setaria from 'setaria'

new Setaria({
  // 初始化数据获取
  getInitialState({ http }) {
    return new Promise((resolve, reject) => {
      http.biz.get('user')
        .then(res => resolve({ user: res.data }))
        .catch(reject)
    })
  },
  
  // 错误处理
  errorHandler(error, type, origin) {
    console.error('Error:', error.errorMessage)
  },
  
  // HTTP配置
  http: {
    defaults: {
      timeout: 30000,
      showLoading: true
    },
    biz: {
      baseURL: 'https://api.example.com'
    }
  },
  
  // 路由配置
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About }
  ]
})
```

这个依赖功能说明文档展示了Setaria框架如何整合各个依赖包，为企业级前端应用开发提供完整的解决方案。