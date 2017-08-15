/**
 * Setaria v0.0.4
 * (c) 2017 Ray Han
 * @license MIT
 */
import Vue$1 from 'vue';
import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/zh-cn';
import axios from 'axios';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

var config = {
  message: '',
  errorHanlder: null,
  router: {}
};

var applyMixin = function () {
  // const version = Number(Vue.version.split('.')[0])

  // if (version >= 2) {
  //   Vue.mixin({ beforeCreate: vuexInit })
  // } else {
  //   // override init and inject vuex init procedure
  //   // for 1.x backwards compatibility.
  //   const _init = Vue.prototype._init
  //   Vue.prototype._init = function (options = {}) {
  //     options.init = options.init
  //       ? [vuexInit].concat(options.init)
  //       : vuexInit
  //     _init.call(this, options)
  //   }
  // }

  // /**
  //  * Vuex init hook, injected into each instances init hooks list.
  //  */
  //
  // function vuexInit () {
  //   const options = this.$options
  //   // store injection
  //   if (options.store) {
  //     this.$store = typeof options.store === 'function'
  //       ? options.store()
  //       : options.store
  //   } else if (options.parent && options.parent.$store) {
  //     this.$store = options.parent.$store
  //   }
  // }
};

function install (_Vue) {
  if (Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[setaria] already installed. Vue.use(Setaria) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

// auto install in dist mode
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

var Util = function Util () {};

Util.isProdunctionEnv = function isProdunctionEnv () {
  return process.env.NODE_ENV === 'production'
};

/**
 * 使用指定格式取得当前时间
 * @param{String} format 指定格式（moment格式）
 * @return {String} 当前时间
 */
Util.getNow = function getNow (format) {
    if ( format === void 0 ) format = 'LL';

  return moment().format(format)
};

/**
 * 对日期使用指定格式进行格式化
 * @param{Date|String} date 日期
 * @param{String}    format 格式化字符串
 * @return {String}    格式化后的日期
 */
Util.formatDate = function formatDate (date, format) {
    if ( format === void 0 ) format = 'YYYY-MM-DD';

  var ret = '';
  if (moment(date).isValid() && date !== undefined) {
    ret = moment(date).format(format);
  }
  return ret
};

/**
 * 字符串类型日期转换成日期对象
 * @param{String} val
 * @return {Date}
 */
Util.toDate = function toDate (val) {
  var ret = val;
  if (!Util.isEmpty(val)) {
    ret = moment(val).toDate();
  }
  return ret
};

/**
 * 对时间进行加法计算
 * @param{String|Date} date 指定时间
 * @param{Number}    val值
 * @param{String}    type 类型
 * @return {Date}      计算后的时间
 */
Util.addDateTime = function addDateTime (date, val, type) {
  return moment(date).add(val, type)
};

/**
 * 对时间进行减法计算
 * @param{String|Date} date 指定时间
 * @param{Number}    val值
 * @param{String}    type 类型
 * @return {Date}      计算后的时间
 */
Util.subtractDateTime = function subtractDateTime (date, val, type) {
  return moment(date).subtract(val, type)
};

/**
 * 检查输入值是否为空
 * 注意：无法判断基本类型（整数，布尔）
 * @param{*}     value 检查的值
 * @return {Boolean} 值为空的场合返回true
 */
Util.isEmpty = function isEmpty (value) {
  return _.isEmpty(value)
};

/**
 * 判断两个输入值值是否相等
 * 主要用于对数组或对象进行判断
 * @param{*}     value 输入值
 * @param{*}     other 输入值
 * @return {Boolean} 两个值相等的场合返回true
 */
Util.isEqual = function isEqual (value, other) {
  return _.isEqual(value, other)
};

/**
 * 检查输入值是否为数字
 * @param{*}     value 输入值
 * @return {Boolean} 输入值为数字的场合，返回true
 */
Util.isNumber = function isNumber (value) {
  return _.isNumber(value)
};

/**
 * 检查输入值是否为字符串
 * @param{*}     value 输入值
 * @return {Boolean} 输入值为字符串类型的场合，返回true
 */
Util.isString = function isString (value) {
  return _.isString(value)
};

/**
 * 检查输入值是否为日期
 * @param{*}     value 输入值
 * @return {Boolean} 输入值为日期的场合，返回true
 */
Util.isDate = function isDate (value) {
  return _.isDate(value)
};

/**
 * 检查输入值是否为数组
 * @param{*}     value 检查的值
 * @return {Boolean} 是数组的场合，返回true
 */
Util.isArray = function isArray (value) {
  return _.isArray(value)
};

/**
 * 检查输入值是否为对象
 * @param{*}     value 输入值
 * @return {Boolean} 输入值为对象的场合，返回true
 */
Util.isObject = function isObject (value) {
  return _.isObject(value)
};

/**
 * 检查输入值是否为函数
 * @param{*}     value 输入值
 * @return {Boolean} 输入值为函数的场合，返回true
 */
Util.isFunction = function isFunction (value) {
  return _.isFunction(value)
};

/**
 * 取得对象中指定的值
 * @param{Object} object
 * @param{String} path
 * @param{*}    defaultValue
 * @return {*}    指定的值
 */
Util.get = function get (object, path, defaultValue) {
    if ( defaultValue === void 0 ) defaultValue = null;

  return _.get(object, path, defaultValue)
};

/**
 * 对指定对象进行深拷贝
 * @param{*} objects 欲拷贝的值
 * @return {*} 拷贝后的值
 */
Util.cloneDeep = function cloneDeep (objects) {
  return _.cloneDeep(objects)
};

/**
 * 取得url中指定参数的值
 * @param{String} paramKey
 * @return {String|Array}
 */
Util.getUrlParameter = function getUrlParameter (paramKey) {
  var urlParam = window.location.search.substring(1);
  var urlVariables = urlParam.split('&');
  var ret = urlVariables.find(function (key) { return key.split('=')[0] === paramKey; });
  if (ret) {
    ret = ret.split('=')[1];
  }
  return ret
};

// M[Message Catagory]XXX[Message Type]
// Message Catagory:
//   AM Application Message
// Message Type:
//   E Error
//   I Info
//   W Warning
var MESSAGE = {
  MAM001E: '服务调用出现网络错误，无法调用指定服务，请检查网络。',
  MAM002E: '由于您长时间未操作，登录状态已过期，请重新登录。',
  MAM003E: '服务未在预定时间（{0}秒）内返回结果，请联系管理员或稍后重试。',
  MAM004E: '客户端出现错误，请重试或联系管理员。',
  MAM005E: '认证过期或无权访问此服务，请点击注销按钮重新登录。',
  MAM006E: '无法找到指定的画面。',
  MAM007E: '服务调用出现未知错误，请重试或联系管理员。',
  MAM008E: '无法找到指定的{0}定义文件。'
};

var MESSAGE_TYPE = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error'
};

function getCustomMessageObject () {
  var ret = {};
  var customMessageObject = config.message;
  if (!Util.isEmpty(customMessageObject)) {
    // 文件路径的场合
    if (Util.isString(customMessageObject)) {
      // TODO 在非Webpack环境下取得消息文件
    } else if (Util.isObject(customMessageObject)) {
      ret = customMessageObject;
    }
  }
  return ret
}

function getMessageObject () {
  return Object.assign({}, MESSAGE, getCustomMessageObject())
}

function getMessageById (id) {
  var messageObject = getMessageObject();
  return messageObject[id]
}

/**
 * 格式化指定消息
 * @param  {String} id     消息ID
 * @param  {Array}  params 消息参数
 * @return {String} 已格式化的消息
 */
function formatMessage (id, params) {
  if ( id === void 0 ) id = '';

  var ret = Util.isEmpty(getMessageById(id)) ? '' : getMessageById(id);
  if (!Util.isEmpty(ret) && !Util.isEmpty(params)) {
    params.forEach(function (item, index) {
      ret = ret.split(("{" + index + "}")).join(params[index]);
    });
  }
  return ret
}

/**
 * 根据消息ID取得对应的消息类型
 * @param  {String} id 消息ID
 * @return {String} 消息类型
 */
function getMessageType (id) {
  if ( id === void 0 ) id = null;

  var ret = '';
  var type = id !== null ? id.charAt(id.length - 1) : '';
  switch (type) {
    case 'E':
      ret = 'error';
      break
    case 'W':
      ret = 'warning';
      break
    case 'I':
      ret = 'info';
      break
    default:
      ret = 'error';
  }
  return ret
}

var Message = function Message (id, params, message) {
  this.id = id;
  this.type = getMessageType(id);
  this.params = params;
  this.message = formatMessage(this.id, this.params);
  if (Util.isEmpty(this.message) && !Util.isEmpty(message)) {
    this.message = message;
  }
};

Message.prototype.getMessage = function getMessage () {
  return this.message
};

Message.prototype.toString = function toString () {
  return this.message
};

var ERROR_PREFIX = 'Setaria Error';
var ERROR_MSG_SPLICER = ':';

var ApplicationError = (function (Error) {
  function ApplicationError (id, params, message) {
    var msg = message;
    if (Util.isEmpty(message)) {
      msg = new Message(id, params, message).getMessage();
      msg = ERROR_PREFIX + "[" + id + "]" + ERROR_MSG_SPLICER + msg;
    }
    Error.call(this, msg);
    this.id = id;
    this.params = params;
    this.type = MESSAGE_TYPE.ERROR;
    this.message = msg;
  }

  if ( Error ) ApplicationError.__proto__ = Error;
  ApplicationError.prototype = Object.create( Error && Error.prototype );
  ApplicationError.prototype.constructor = ApplicationError;

  return ApplicationError;
}(Error));

function isSetariaError (error) {
  var ret = false;
  if (Util.isObject(error) && !Util.isEmpty(error.id)) {
    ret = true;
  } else if (Util.isString(error)) {
    ret = error.indexOf(ERROR_PREFIX) !== -1;
  }
  return ret
}

function parseSetariaError (error) {
  var msg = error;
  if (Util.isObject(error)) {
    msg = error.message;
  }
  // 删除浏览器添加的错误信息前缀
  msg = msg.replace('Uncaught Error: ', '');
  // 解析错误信息，取得错误代码和错误内容
  var msgArr = msg.split(ERROR_MSG_SPLICER);
  var id = msgArr[0].replace(ERROR_PREFIX, '').replace('[', '').replace(']', '');
  var message = msgArr[1];
  return new ApplicationError(id, null, message)
}

var ErrorHandler = function ErrorHandler () {};

ErrorHandler.catchError = function catchError () {
  Vue$1.config.errorHandler = function (err, vm) {
    ErrorHandler.handleError(err, vm);
  };
  window.onerror = function (err) {
    ErrorHandler.handleError(err);
  };
  window.onunhandledrejection = function (err) {
    ErrorHandler.handleError(err);
  };
};

/**
 * 处理捕获的异常
 * @param{String|Object} error异常
 * @param{Object}      source 触发异常的示例
 */
ErrorHandler.handleError = function handleError (error, source) {
  // 取得错误内容
  var errorObject = ErrorHandler.parseError(error, source);
  if (Util.isFunction(config.errorHanlder)) {
    config.errorHanlder(errorObject, error);
  }
};

/**
 * 解析异常
 * @param{[type]} error[description]
 * @param{[type]} source [description]
 * @return {[type]}      [description]
 */
ErrorHandler.parseError = function parseError (error, source) {
  var ret = null;
  var isErrorFromVue = source instanceof Object;
  // 自定义异常对象的场合
  if (isSetariaError(error)) {
    ret = parseSetariaError(error);
  // Promise中没有捕获的错误
  // 当在不支持PromiseRejectionEvent的浏览器中，通过PromiseRejectionEvent判断会报错
  } else if (!Util.isEmpty(error.reason)) {
    ret = error.reason;
  // 执行期异常的场合
  } else if (error instanceof Error) {
    if (Util.isProdunctionEnv()) {
      ret = new ApplicationError('MAM004E');
    } else {
      ret = error;
    }
  // 来源：组件渲染
  } else if (isErrorFromVue) {
    if (Util.isProdunctionEnv()) {
      ret = new ApplicationError('MAM004E');
    } else {
      ret = error;
    }
  // // 来源：未知
  // } else if (error instanceof Object
  // && Object.prototype.hasOwnProperty.call(error, 'message')) {
  // ret = new ApplicationError(null, null, error.message)
  // 在事件函数中抛出ApplicationError的场合
  // 没有捕获的错误。（来源：事件函数中的运行期错误）
  } else if (Util.isString(error)) {
    if (error.indexOf('Uncaught Error: ') === 0) {
      ret = error.replace('Uncaught Error: ', '');
    }
    ret = new ApplicationError(null, null, ret);
  }
  if (ret === null || ret === undefined ||
    (!Util.isEmpty(ret) && Util.isEmpty(ret.message))) {
    ret = new ApplicationError('MAM004E');
  }

  // 实现了Vue.config.errorHandler接口的场合，Vue不会在控制台显示错误。
  // if (isErrorFromVue) {
  // /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
  // console.error(error)
  // }
  return ret
};

/**
 * 远程服务调用模块
 * @version 1.0
 * @author HanL
 */
var REQUEST_TYPE = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete'
};

function execute (type, url, data, config) {
  if ( config === void 0 ) config = {};

  var ret = null;
  var p = null;
  var axiosConfig = config;
  if (type === REQUEST_TYPE.GET) {
    axiosConfig.params = data;
    p = axios[REQUEST_TYPE.GET](url, axiosConfig);
  } else {
    p = axios[type](url, data, axiosConfig);
  }

  ret = new Promise(function (resolve, reject) {
    p.then(function (res) {
      resolve(res);
    }).catch(function (error) {
      var rejectError = error;
      if (error.message.indexOf('timeout of') === 0) {
        // TODO 取得配置的服务调用超时时间
        var timeout = 1000;
        rejectError = new ApplicationError('MAM003E', [timeout]);
      } else if (error.response) {
        // 服务器错误
        if (error.response.status >= 500) {
          rejectError = new ApplicationError('MAM001E');
        }
      }
      reject(rejectError);
    });
  });
  return ret
}

var Http = function Http () {};

Http.get = function get (url, data, config) {
  return execute(REQUEST_TYPE.GET, url, data, config)
};

Http.post = function post (url, data, config) {
  return execute(REQUEST_TYPE.POST, url, data, config)
};

Http.put = function put (url, data, config) {
  return execute(REQUEST_TYPE.PUT, url, data, config)
};

Http.delete = function delete$1 (url, data, config) {
  return execute(REQUEST_TYPE.DELETE, url, data, config)
};

// import config from '../../config/index'
// import ApplicationError from '../../model/ApplicationError'
// import util from '../../util'

// function getDirection (to, from, next) {
//   const params = to.params
//   const currentPageFullPath = from.fullPath
//   let direction = store.state.common.direction
//   let isExistForwardPage = false
//   const nextPageFullPath = to.fullPath
//   const history = routeHistroy.history
//   if (params && params.$$direction === 'forward') {
//     direction = 'forward'
//     // 保存跳转方向
//     store.commit('common/direction', direction)
//   }
//   // 浏览器前进／后退按钮点击 或 点击了页面链接 的场合
//   if (direction !== 'forward' && direction !== 'back') {
//     if (history.length === 0) {
//       routeHistroy.currentIndex = 0
//       history.push(currentPageFullPath)
//       next()
//       return
//     }
//     if (history.length > 0) {
//       // 当前游标处于最末尾
//       if (routeHistroy.currentIndex === history.length - 1) {
//         const path = history[routeHistroy.currentIndex]
//         // 跳转画面的路径为前画面的场合
//         if (path === nextPageFullPath) {
//           direction = 'back'
//         } else {
//           direction = 'forward'
//         }
//       // 当前画面拥有次画面
//       } else {
//         let path = null
//         // 判断目标画面是否为前画面
//         if (routeHistroy.currentIndex !== 0) {
//           path = history[routeHistroy.currentIndex]
//           if (path === nextPageFullPath) {
//             direction = 'back'
//           }
//         }
//         // 判断目标画面是否为次画面
//         if (direction === '') {
//           path = history[routeHistroy.currentIndex + 1]
//           if (path === nextPageFullPath) {
//             direction = 'forward'
//             isExistForwardPage = true
//           }
//         }
//       }
//       // 保存跳转方向
//       store.commit('common/direction', direction)
//     }
//   }
//
//   if (direction === '') {
//     direction = 'forward'
//     // 保存跳转方向
//     store.commit('common/direction', direction)
//   }
//
//   // 更新浏览历史
//   if (direction === 'back') {
//     if (routeHistroy.currentIndex === 0) {
//       routeHistroy.currentIndex = null
//     } else {
//       history[routeHistroy.currentIndex] = currentPageFullPath
//       routeHistroy.currentIndex -= 1
//     }
//   } else if (direction === 'forward') {
//     if (!isExistForwardPage) {
//       if (routeHistroy.currentIndex < history.length - 1) {
//         let index = history.length - 1
//         for (index; index > routeHistroy.currentIndex; index -= 1) {
//           history.splice(index, 1)
//         }
//       }
//       history.push(currentPageFullPath)
//     } else {
//       history[routeHistroy.currentIndex + 1] = currentPageFullPath
//     }
//     routeHistroy.currentIndex += 1
//   }
//   next()
// }

function install$1 (Vue) {
  if (install$1.installed) {
    return
  }
  install$1.installed = true;
  VueRouter.install(Vue);
  Vue.mixin({
    destroyed: function destroyed () {
      this.$store.commit('common/direction', '');
    }
  });
}

// initial state
var state = {
  direction: '',
  loading: false,
  routeHistory: {
    currentIndex: null,
    history: []
  },
  token: '',
  user: null
};

// getters
var getters = {
  routeHistory: function (state) { return state.routeHistory; },
  routeCurrentIndex: function (state) { return state.routeHistory.currentIndex; }
};

// actions
var actions = {
};

// mutations
var mutations = {
  direction: function direction (stateObj, val) {
    var s = stateObj;
    s.direction = val;
  },
  loading: function loading (stateObj, val) {
    var s = stateObj;
    s.loading = val;
  },
  token: function token (stateObj, val) {
    var s = stateObj;
    s.token = val;
  },
  user: function user (stateObj, val) {
    var s = stateObj;
    s.user = val;
  },
  updateDirection: function updateDirection (stateObj, ref) {
    var current = ref.current;
    var next = ref.next;

    var direction = stateObj.direction;
    console.log('updateDirection', direction);
    var routeHistory = stateObj.routeHistory;
    if (direction !== 'forward' && direction !== 'back') {
      if (routeHistory.history.length > 0) {
        // 当前游标处于最末尾
        if (routeHistory.currentIndex === routeHistory.history.length - 1) {
          // const path = routeHistory.history[routeHistory.currentIndex]
          // if (path === next) {
          direction = 'back';
          // } else {
            // direction = 'forward'
          // }
        } else {
          var path = null;
          // 判断目标画面是否为前画面
          if (routeHistory.currentIndex !== 0) {
            path = routeHistory.history[routeHistory.currentIndex];
            if (path === next) {
              direction = 'back';
            }
          }
          // 判断目标画面是否为次画面
          if (direction === '') {
            path = routeHistory.history[routeHistory.currentIndex + 1];
            if (path === next) {
              direction = 'forward';
            }
          }
        }
      } else {
        direction = 'forward';
      }
      if (direction !== 'forward' && direction !== 'back') {
        direction = 'forward';
      }
      // 保存跳转方向
      stateObj.direction = direction;
    }
    console.log(stateObj.direction);
  },
  updateHistory: function updateHistory (stateObj, ref) {
    var current = ref.current;
    var next = ref.next;

    var direction = stateObj.direction;
    var routeHistory = stateObj.routeHistory;
    // 更新浏览历史
    if (direction === 'back') {
      if (routeHistory.currentIndex === 0) {
        routeHistory.currentIndex = null;
      } else {
        routeHistory.history[routeHistory.currentIndex] = current;
        routeHistory.currentIndex -= 1;
      }
    } else if (direction === 'forward') {
      // if (!isExistForwardPage) {
      //   if (routeHistory.currentIndex < history.length - 1) {
      //     let index = history.length - 1
      //     for (index; index > routeHistory.currentIndex; index -= 1) {
      //       history.splice(index, 1)
      //     }
      //   }
      //   history.push(currentPageFullPath)
      // } else {
      // }
      if (routeHistory.currentIndex === null) {
        routeHistory.currentIndex = 0;
      } else {
        // 如果未处于队列末尾,则删除当前游标后的数据
        if (routeHistory.currentIndex < routeHistory.history.length - 1) {
          var history = routeHistory.history.splice(0, routeHistory.currentIndex + 1);
          routeHistory.history = history;
        }
        routeHistory.currentIndex += 1;
      }
      routeHistory.history.push(next);
    }
  }
};

var common = {
  namespaced: true,
  state: state,
  getters: getters,
  actions: actions,
  mutations: mutations
};

var debug = process.env.NODE_ENV !== 'production';
var structure = {
  modules: {
    common: common
  },
  strict: debug
};

var store$2;

function create (Store) {
  store$2 = new Store(structure);
  return store$2
}

Vue$1.use(Vuex);
var store = create(Vuex.Store);

var updateDirection = function (to, from, next) {
  var params = to.params;
  var currentPageFullPath = from.fullPath;
  var direction = store.state.common.direction;
  var nextPageFullPath = to.fullPath;
  if (params && params.$$direction === 'forward') {
    direction = 'forward';
    // 保存跳转方向
    store.commit('common/direction', direction);
  }
  // 浏览器前进／后退按钮点击 或 点击了页面链接 的场合
  store.commit('common/updateDirection', {
    current: currentPageFullPath,
    next: nextPageFullPath
  });
  // if (direction === '') {
  //   direction = 'forward'
  //   // 保存跳转方向
  //   store.commit('common/direction', direction)
  // }
  next();
};

var updateHistory = function (to, from, next) {
  var currentPageFullPath = from.fullPath;
  var nextPageFullPath = to.fullPath;
  store.commit('common/updateHistory', {
    current: currentPageFullPath,
    next: nextPageFullPath
  });
  next();
};

// TODO: 引入Router的方式不太恰当，但在navigate插件中需要注册路由全局钩子，不知该如何取得router对象
// 限制1: 不支持同一路由不同参数间画面的跳转 /user/1 -> /user/2
// 限制2: 不支持<router-link>的方式跳转，且此链接内如果定义path，则params不生效（vue-router的限制）
// 限制3: 新增<navi-link>用于定义静态路由链接。
var Navigate = (function (VueRouter$$1) {
  function Navigate (options) {
    if ( options === void 0 ) options = {};

    VueRouter$$1.call(this, options);
    // 注册全局路由钩子
    this.beforeEach(updateDirection);
    this.beforeEach(updateHistory);
  }

  if ( VueRouter$$1 ) Navigate.__proto__ = VueRouter$$1;
  Navigate.prototype = Object.create( VueRouter$$1 && VueRouter$$1.prototype );
  Navigate.prototype.constructor = Navigate;

  Navigate.prototype.forwardTo = function forwardTo (name, params, query) {
    if ( params === void 0 ) params = {};
    if ( query === void 0 ) query = {};

    // 删除
    // if (this.routeHistroy.currentIndex !== this.routeHistroy.history.length - 1) {
    //   let index = this.routeHistroy.history.length - 1
    //   for (index; index > this.routeHistroy.currentIndex; index -= 1) {
    //     this.routeHistroy.history.splice(index - 1, 1)
    //   }
    // }
    // this.routeHistroy.history.push(this.currentRoute.fullPath)
    // this.routeHistroy.currentIndex = this.routeHistroy.history.length - 1
    store.commit('common/direction', 'forward');
    this.push({
      name: name,
      params: params,
      query: query
    });
  };

  Navigate.prototype.push = function push (location, onComplete, onAbort) {
    store.commit('common/direction', 'forward');
    VueRouter$$1.prototype.push.call(this, location, onComplete, onAbort);
  };

  Navigate.prototype.forward = function forward () {
    store.commit('common/direction', 'forward');
    VueRouter$$1.prototype.forward.call(this);
  };

  Navigate.prototype.backTo = function backTo () {
    store.commit('common/direction', 'back');
    VueRouter$$1.prototype.back.call(this);
  };

  return Navigate;
}(VueRouter));

Navigate.install = install$1;
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Navigate);
}

// -- 环境变量设置
// 生产环境的场合
if (Util.isProdunctionEnv()) {
  // 不显示Vue日志和警告
  Vue$1.config.silent = true;
  // 不显示Vue产品信息
  Vue$1.config.productionTip = false;
}

// -- 异常处理
ErrorHandler.catchError();

var index_esm = {
  install: install,
  config: config,
  plugin: {
    Navigate: Navigate,
    store: store
  },
  version: '0.0.4'
};

export { ApplicationError, Http, Message, Util as util };export default index_esm;
