/**
 * Setaria v0.1.0
 * (c) 2018 Ray Han
 * @license MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue'), require('lodash'), require('moment'), require('moment/locale/zh-cn'), require('axios'), require('vue-router'), require('vuex')) :
	typeof define === 'function' && define.amd ? define(['vue', 'lodash', 'moment', 'moment/locale/zh-cn', 'axios', 'vue-router', 'vuex'], factory) :
	(global.Setaria = factory(global.Vue,global._,global.moment,null,global.axios,global.VueRouter,global.Vuex));
}(this, (function (Vue,_,moment,moment_locale_zhCn,axios,VueRouter,Vuex) { 'use strict';

Vue = 'default' in Vue ? Vue['default'] : Vue;
_ = 'default' in _ ? _['default'] : _;
moment = 'default' in moment ? moment['default'] : moment;
axios = 'default' in axios ? axios['default'] : axios;
VueRouter = 'default' in VueRouter ? VueRouter['default'] : VueRouter;
Vuex = 'default' in Vuex ? Vuex['default'] : Vuex;

/*  */

var config = ({
  message: null,
  errorHanlder: null
});

// import applyMixin from './mixin'

function install (_Vue) {
  // if (Vue) {
  //   if ("development" !== 'production') {
  //     console.error(
  //       '[setaria] already installed. Vue.use(Setaria) should be called only once.'
  //     )
  //   }
  //   return
  // }
  // Vue = _Vue
  // applyMixin(Vue)
}

/*  */
var Util = function Util () {};

Util.isProdunctionEnv = function isProdunctionEnv () {
  return "development" === 'production'
};

Util.isFirefox = function isFirefox () {
  var agent = window.navigator.userAgent.toLowerCase();
  return (typeof window !== 'undefined' && agent) &&
    /firefox\/\d+/.test(agent)
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
 * 例：addDateTime(new Date(), 7, 'days')
 */
Util.addDateTime = function addDateTime (date, val, type) {
  return moment(date).add(val, type)
};

/**
 * 对时间进行减法计算
 * 例：subtractDateTime(new Date(), 7, 'days')
 */
Util.subtractDateTime = function subtractDateTime (date, val, type) {
  return moment(date).subtract(val, type)
};

/**
 * 检查输入值是否为空
 * 注意：无法判断基本类型（整数，布尔）
 */
Util.isEmpty = function isEmpty (value) {
  return _.isEmpty(value)
};

/**
 * 判断两个输入值值是否相等
 * 主要用于对数组或对象进行判断
 */
Util.isEqual = function isEqual (value, other) {
  return _.isEqual(value, other)
};

/**
 * 检查输入值是否为数字
 */
Util.isNumber = function isNumber (value) {
  return _.isNumber(value)
};

/**
 * 检查输入值是否为字符串
 */
Util.isString = function isString (value) {
  return _.isString(value)
};

/**
 * 检查输入值是否为日期
 */
Util.isDate = function isDate (value) {
  return _.isDate(value)
};

/**
 * 检查输入值是否为数组
 */
Util.isArray = function isArray (value) {
  return _.isArray(value)
};

/**
 * 检查输入值是否为对象
 */
Util.isObject = function isObject (value) {
  return _.isObject(value)
};

/**
 * 检查输入值是否为函数
 */
Util.isFunction = function isFunction (value) {
  return _.isFunction(value)
};

/**
 * 取得对象中指定的值
 */
Util.get = function get (object, path, defaultValue) {
    if ( defaultValue === void 0 ) defaultValue = null;

  return _.get(object, path, defaultValue)
};

/**
 * 对指定对象进行深拷贝
 */
Util.cloneDeep = function cloneDeep (objects) {
  return _.cloneDeep(objects)
};

/**
 * 取得url中指定参数的值
 */
Util.getUrlParameter = function getUrlParameter (paramKey) {
  var urlParam = window.location.search.substring(1);
  var urlVariables = urlParam.split('&');
  var ret = urlVariables.find(function (key) { return key.split('=')[0] === paramKey; });
  if (ret === null || ret === undefined) {
    ret = '';
  } else {
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
  MAM001E: '调用远程服务的过程中出现未知错误，请重试或联系管理员。',
  MAM002E: '由于您长时间未操作，登录状态已过期，请重新登录。',
  MAM003E: '服务未在预定时间（{0}秒）内返回结果，请联系管理员或稍后重试。',
  MAM004E: '客户端出现错误，请重试或联系管理员。',
  MAM005E: '认证过期或无权访问此服务，请点击注销按钮重新登录。',
  MAM006E: '无法找到指定的画面。',
  MAM007E: '请求的服务访问超时，请联系管理员或稍后重试。',
  MAM008E: '无法找到指定的{0}定义文件。',
  MAM404E: '请求的服务不存在。'
};

/*  */
var MESSAGE_TYPE = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error'
};

/**
 * 取得自定义消息对象
 */
function getCustomMessageObject () {
  return config.message ? config.message : {}
}

/**
 * 取得系统消息对象和自定义消息对象
 */
function getMessageObject () {
  return Object.assign({}, MESSAGE, getCustomMessageObject())
}

/**
 * 根据消息ID取得对应的消息
 */
function getMessageById (id) {
  return getMessageObject()[id]
}

/**
 * 格式化指定消息
 */
function formatMessage (id, params) {
  if ( id === void 0 ) id = '';
  if ( params === void 0 ) params = [];

  var message = getMessageById(id);
  var ret = (message === null || message === undefined) ? '' : message;
  if (!Util.isEmpty(ret) && !Util.isEmpty(params)) {
    params.forEach(function (item, index) {
      var replaceString = "{" + index + "}";
      // 存在要替换的字符串的场合
      if (ret.indexOf(replaceString) !== -1) {
        var str = (typeof item === 'number') ? item.toString() : item;
        ret = ret.split(replaceString).join(str);
      }
    });
  }
  return ret
}

/**
 * 根据消息ID取得对应的消息类型
 */
function getMessageType (id) {
  var ret = '';
  var type = id.charAt(id.length - 1);
  switch (type) {
    case 'E':
      ret = 'error';
      break
    case 'W':
      ret = 'warning';
      break
    case 'I':
    default:
      ret = 'info';
  }
  return ret
}

var Message = function Message (id, params, message) {
  if ( id === void 0 ) id = '';
  if ( params === void 0 ) params = [];
  if ( message === void 0 ) message = '';

  this.id = id;
  this.type = getMessageType(id);
  this.params = params;
  this.message = formatMessage(this.id, this.params);
  if (Util.isEmpty(this.message) && !Util.isEmpty(message)) {
    this.message = message;
  }
};

/**
 * 取得消息内容
 */
Message.prototype.getMessage = function getMessage () {
  return this.message
};

Message.prototype.toString = function toString () {
  return this.message
};

/*  */
var ERROR_PREFIX = 'Setaria Error';
var ERROR_MSG_SPLICER = ':';

var ApplicationError = (function (Error) {
  function ApplicationError (id, params, message) {
    if ( id === void 0 ) id = '';
    if ( params === void 0 ) params = [];
    if ( message === void 0 ) message = '';

    var msg = message;
    if (Util.isEmpty(id)) {
      id = 'unknown';
    }
    if (Util.isEmpty(message)) {
      msg = new Message(id, params, message).getMessage();
    }
    var fullMessage = ERROR_PREFIX + "[" + id + "]" + ERROR_MSG_SPLICER + msg;
    Error.call(this, fullMessage);
    this.id = id;
    this.params = params;
    this.type = MESSAGE_TYPE.ERROR;
    this.noIdMessage = msg;
    this.message = fullMessage;
  }

  if ( Error ) ApplicationError.__proto__ = Error;
  ApplicationError.prototype = Object.create( Error && Error.prototype );
  ApplicationError.prototype.constructor = ApplicationError;

  return ApplicationError;
}(Error));

/*  */
function dispatchUnHandlerRejectEvent (reason) {
  var event = document.createEvent('Event');
  event.initEvent(
    'unhandledrejection', // Define that the event name is 'unhandledrejection'
    false, // PromiseRejectionEvent is not bubbleable
    true // PromiseRejectionEvent is cancelable
  );
  /**
   * Note: these properties should not be enumerable, which is the default setting
   */
  var properties = {
    reason: {
      value: reason,
      writable: false
    }
  };
  Object.defineProperties(event, properties);
  window.dispatchEvent(event);
}

var ServiceError = (function (ApplicationError$$1) {
  function ServiceError (id, reason,
    params, message) {
    if ( id === void 0 ) id = '';
    if ( reason === void 0 ) reason = {};
    if ( params === void 0 ) params = [];
    if ( message === void 0 ) message = '';

    ApplicationError$$1.call(this, id, params, message);
    this.type = 'ServiceError';
    this.detail = reason;
    // 在Firefox下只要不是已经明确设置不显示异常，否则抛出'unhandledrejection'事件
    if (Util.isFirefox() && Util.get(reason, 'config.isShowError', true) !== false) {
      dispatchUnHandlerRejectEvent(this);
    }
  }

  if ( ApplicationError$$1 ) ServiceError.__proto__ = ApplicationError$$1;
  ServiceError.prototype = Object.create( ApplicationError$$1 && ApplicationError$$1.prototype );
  ServiceError.prototype.constructor = ServiceError;

  return ServiceError;
}(ApplicationError));

/*  */
function isSetariaError (error) {
  var ret = false;
  if (error instanceof Object && error !== null &&
    error !== undefined && error.id !== null &&
    error.id !== undefined) {
    ret = true;
  } else if (typeof error === 'string') {
    ret = error.indexOf(ERROR_PREFIX) !== -1;
  }
  return ret
}

function parseSetariaError (error) {
  var id = '';
  var message = '';
  if (typeof error === 'string') {
    // 删除浏览器添加的错误信息前缀
    // firefox
    if (error.indexOf('Error: ') === 0) {
      error = error.replace('Error: ', '');
    // chrome, safari
    } else if (error.indexOf('Uncaught Error: ') === 0) {
      error = error.replace('Uncaught Error: ', '');
    }
    // 解析错误信息，取得错误代码和错误内容
    var msgArr = error.split(ERROR_MSG_SPLICER);
    id = msgArr[0].replace(ERROR_PREFIX, '').replace('[', '').replace(']', '');
    message = msgArr[1];
    return new ApplicationError(id, [], message)
  } else {
    return new ApplicationError(error.id, [], error.noIdMessage)
  }
}

var ErrorHandler = function ErrorHandler () {};

ErrorHandler.catchError = function catchError () {
  // Vue异常
  Vue.config.errorHandler = function (err, vm) {
    ErrorHandler.handleError(err, vm);
  };
  // JavaScript执行期异常
  window.onerror = function (err) {
    ErrorHandler.handleError(err);
  };
  // promise异常
  // 目前最新版的Firefox浏览器不支持PromiseRejectionEvent
  window.addEventListener('unhandledrejection', function (err) {
    ErrorHandler.handleError(err);
  });
};

/**
 * 处理捕获的异常
 */
ErrorHandler.handleError = function handleError (error, source) {
  // 取得错误内容
  var errorObject = this.parseError(error, source);
  if (typeof config.errorHanlder === 'function') {
    config.errorHanlder(errorObject, error);
  }
};

/**
 * 解析异常
 */
ErrorHandler.parseError = function parseError (error, source) {
  var ret = null;
  var isErrorFromVue = source instanceof Object;
  // 自定义异常对象的场合
  if (isSetariaError(error)) {
    ret = parseSetariaError(error);
  // 没有捕获Promise中抛出的异常
  // 当在不支持PromiseRejectionEvent的浏览器中，通过PromiseRejectionEvent判断会报错
  } else if (error.type === 'unhandledrejection' && typeof error === 'object') {
    var ref = error.reason;
      var id = ref.id;
      var message = ref.message;
      var noIdMessage = ref.noIdMessage;
      var detail = ref.detail;
    if (error.reason.type === 'ServiceError') {
      ret = error.reason;
    } else {
      // ApplicationError
      if (noIdMessage !== null && noIdMessage !== undefined) {
        ret = new ServiceError(id, detail, [], noIdMessage);
      // Error
      } else if (message !== null && message !== undefined) {
        ret = new ServiceError('', detail, [], message);
      } else {
        ret = new ServiceError('MAM004E', detail);
      }
    }
  // 组件渲染或组件事件函数执行时抛出异常的场合
  // 执行期异常的场合
  } else if (isErrorFromVue && error instanceof Error) {
    if (Util.isProdunctionEnv()) {
      ret = new ApplicationError('MAM004E');
    } else {
      var message$1 = error.message;
      ret = new ApplicationError('', [], message$1);
    }
  // // 来源：未知
  // } else if (error instanceof Object
  // && Object.prototype.hasOwnProperty.call(error, 'message')) {
  // ret = new ApplicationError(null, null, error.message)
  // 在事件函数中抛出ApplicationError的场合
  // 没有捕获的错误。（来源：事件函数中的运行期错误）
  } else if (typeof error === 'string') {
    if (error.indexOf('Uncaught Error: ') === 0) {
      ret = new ApplicationError('', [], error.replace('Uncaught Error: ', ''));
    } else {
      ret = new ApplicationError('', [], error);
    }
  } else {
    ret = new ApplicationError('MAM004E');
  }

  // 实现了Vue.config.errorHandler接口的场合，Vue不会在控制台显示错误。
  if (isErrorFromVue) {
    /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
    console.error(error);
  }
  return ret
};

// initial state
var state = {
  direction: '',
  loading: 0,
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
  routeCurrentIndex: function (state) { return state.routeHistory.currentIndex; },
  isLoading: function (state) { return state.loading !== 0; }
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
  addLoadingCount: function addLoadingCount (stateObj) {
    var s = stateObj;
    s.loading++;
  },
  subLoadingCount: function subLoadingCount (stateObj) {
    var s = stateObj;
    if (s.loading > 0) {
      s.loading--;
    }
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
    var routeHistory = stateObj.routeHistory;
    if (direction !== 'forward' && direction !== 'back') {
      if (routeHistory.history.length > 0) {
        // 当前游标处于最末尾
        if (routeHistory.currentIndex === routeHistory.history.length - 1) {
          direction = 'back';
        } else {
          var path = null;
          // 判断目标画面是否为前画面
          if (routeHistory.currentIndex !== 0) {
            path = routeHistory.history[routeHistory.currentIndex - 1];
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

/*  */
var debug = "development" !== 'production';
var structure = {
  modules: {
    common: common
  },
  strict: debug
};

var storeInstance;

function createStore (Store) {
  storeInstance = new Store(structure);
  return storeInstance
}

function getStore () {
  return storeInstance
}

/*  */
/**
 * 远程服务调用模块
 * @version 1.0
 * @author HanL
 */
// import type { SetariaStore } from './store'

var REQUEST_TYPE = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
  OPTIONS: 'options',
  PATCH: 'patch'
};

function getHttpStatusMessage (status, error) {
  var ret = new ServiceError('MAM001E', error);
  if (status !== null && status !== undefined) {
    var id = null;
    switch (status) {
      case 404:
        id = '404';
        break
      default:
        id = '001';
    }
    ret = new ServiceError(("MAM" + id + "E"), error);
  }
  return ret
}

function execute (type, url, data, config) {
  if ( config === void 0 ) config = {};

  return new Promise(function (resolve, reject) {
    var p = null;
    var axiosConfig = config;
    if (type === REQUEST_TYPE.GET || type === REQUEST_TYPE.DELETE ||
      type === REQUEST_TYPE.OPTIONS) {
      axiosConfig.params = data;
      p = axios[type](url, axiosConfig);
    } else {
      p = axios[type](url, data, axiosConfig);
    }
    var storeInstance = getStore();
    if (config.loading !== false && storeInstance !== null && storeInstance !== undefined) {
      storeInstance.commit('common/addLoadingCount');
    }
    p.then(function (res) {
      if (config.loading !== false && storeInstance !== null && storeInstance !== undefined) {
        storeInstance.commit('common/subLoadingCount');
      }
      resolve(res);
    }).catch(function (error) {
      if (config.loading !== false && storeInstance !== null && storeInstance !== undefined) {
        storeInstance.commit('common/subLoadingCount');
      }
      var rejectError = new ServiceError('MAM001E', error);
      if (error.response !== null && error.response !== undefined &&
        typeof error.response.status === 'number') {
        rejectError = getHttpStatusMessage(error.response.status, error);
      }
      if (error.message.indexOf('timeout of') === 0) {
        var timeout = error.config.timeout;
        if (timeout === undefined || timeout === null) {
          rejectError = new ServiceError('MAM007E', error);
        } else {
          rejectError = new ServiceError('MAM003E', error, [timeout]);
        }
      }
      reject(rejectError);
    });
  })
}

function executeAll (promiseArr) {
  return new Promise(function (resolve, reject) {
    axios.all(promiseArr)
      .then(function (res) {
        resolve(res);
      });
  })
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

Http.options = function options (url, data, config) {
  return execute(REQUEST_TYPE.OPTIONS, url, data, config)
};

Http.patch = function patch (url, data, config) {
  return execute(REQUEST_TYPE.PATCH, url, data, config)
};

Http.all = function all (promiseArr) {
  return executeAll(promiseArr)
};

Http.spread = function spread (callback) {
  return axios.spread(callback)
};

/*  */
var STORAGE_KEY = '__Setaria_Storage_';
/**
 * Storage生命期类型
 * @type {Object}
 */
var STORAGE_TYPE = {
  LOCAL: 'local',
  SESSION: 'session'
};



/**
 * 取得指定生命周期的Storage实例。
 * 目前支持的生命周期：
 *   local: 永久存在，即使浏览器关闭也不会删除
 *   session: 浏览器使用期间存在，重新载入页面或恢复时也不会删除
 */
function getStorageInstance (scope) {
  return scope === STORAGE_TYPE.LOCAL ? window.localStorage : window.sessionStorage
}

/**
 * 更新指定Storage实例内的Store对象
 */
function setStorageObjectByScope (scope, storageObject) {
  var storage = getStorageInstance(scope);
  storage.setItem(STORAGE_KEY, JSON.stringify(storageObject));
}

/**
 * 取得指定Storage实例内的Store对象
 * @param  {String} scope 生命期
 * @return {Object} Store对象
 */
function getStorageObjectByScope (scope) {
  var storage = getStorageInstance(scope);
  var storageObject = storage.getItem(STORAGE_KEY);
  // Storage对象没有被创建过的场合
  if (storageObject === null) {
    storage.setItem(STORAGE_KEY, JSON.stringify({}));
  }
  return JSON.parse(storage.getItem(STORAGE_KEY))
}

/**
 * 在指定生命周期的Storage实例内进行设值
 */
function setItem (scope, key, value) {
  var storageObject = getStorageObjectByScope(scope);
  storageObject[key] = value;
  setStorageObjectByScope(scope, storageObject);
}

/**
 * 在指定生命周期的Storage实例内进行取值
 */
function getItem (scope, key) {
  return getStorageObjectByScope(scope)[key]
}

/**
 * 删除指定生命周期的Storage实例内的指定值
 * @param  {String} scope 生命期
 * @param  {String} key   键
 */
function removeItem (scope, key) {
  var storageObject = getStorageObjectByScope(scope);
  delete storageObject[key];
  setStorageObjectByScope(scope, storageObject);
}

/**
 * 删除指定生命周期的Storage实例内的所有值
 * @param  {String} scope 生命期
 */
function removeAllItem (scope) {
  setStorageObjectByScope(scope, {});
}

var Storage = function Storage () {};

Storage.setLocalItem = function setLocalItem (key, value) {
  setItem(STORAGE_TYPE.LOCAL, key, value);
};
Storage.getLocalItem = function getLocalItem (key) {
  return getItem(STORAGE_TYPE.LOCAL, key)
};
Storage.removeLocalItem = function removeLocalItem (key) {
  removeItem(STORAGE_TYPE.LOCAL, key);
};
Storage.clearLocal = function clearLocal () {
  removeAllItem(STORAGE_TYPE.LOCAL);
};
Storage.setSessionItem = function setSessionItem (key, value) {
  setItem(STORAGE_TYPE.SESSION, key, value);
};
Storage.getSessionItem = function getSessionItem (key) {
  return getItem(STORAGE_TYPE.SESSION, key)
};
Storage.removeSessionItem = function removeSessionItem (key) {
  removeItem(STORAGE_TYPE.SESSION, key);
};
Storage.clearSession = function clearSession () {
  removeAllItem(STORAGE_TYPE.SESSION);
};

function install$1 (Vue$$1) {
  if (install$1.installed) {
    return
  }
  install$1.installed = true;
  VueRouter.install(Vue$$1);
  Vue$$1.mixin({
    mounted: function mounted () {
      if (this.$store) {
        this.$store.commit('common/direction', '');
      }
    }
  });
}

/*  */
Vue.use(Vuex);
var store = createStore(Vuex.Store);

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
    // this.afterEach(() => {
    //   store.commit('common/direction', '')
    // })
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

  Navigate.prototype.backTo = function backTo () {
    VueRouter$$1.prototype.back.call(this);
  };

  Navigate.prototype.back = function back () {
    store.commit('common/direction', 'back');
    VueRouter$$1.prototype.back.call(this);
  };

  Navigate.prototype.forward = function forward () {
    store.commit('common/direction', 'forward');
    VueRouter$$1.prototype.forward.call(this);
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
  Vue.config.silent = true;
  // 不显示Vue产品信息
  Vue.config.productionTip = false;
}

// -- 异常处理
ErrorHandler.catchError();

var index = {
  install: install,
  config: config,
  plugin: {
    Navigate: Navigate,
    store: store
  },
  version: '0.1.0',
  ApplicationError: ApplicationError,
  ServiceError: ServiceError,
  Http: Http,
  Message: Message,
  Storage: Storage,
  util: Util
};

return index;

})));
