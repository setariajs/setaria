/**
 * Setaria v0.2.11
 * (c) 2018 Ray Han
 * @license MIT
 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(require('vue'));
var _ = _interopDefault(require('lodash'));
var moment = _interopDefault(require('moment'));
require('moment/locale/zh-cn');
var axios = _interopDefault(require('axios'));
var VueRouter = _interopDefault(require('vue-router'));
var Vuex = _interopDefault(require('vuex'));

// M[Message Catagory]XXX[Message Type]
// Message Catagory:
//   AM Application Message
// Message Type:
//   E Error
//   I Info
//   W Warning
var MESSAGE = {
  'SYSMSG-SERVICE-UNKNOWN-ERROR': '调用远程服务的过程中出现未知错误，请重试或联系管理员。',
  'SYSMSG-TIMEOUT': '服务未在预定时间（{0}秒）内返回结果，请联系管理员或稍后重试。',
  'SYSMSG-CLIENT-UNKNOWN-ERROR': '客户端出现错误，请重试或联系管理员。',
  'SYSMSG-SERVICE-NETWORK-ERROR': '远程服务器无法连接，请联系管理员或稍后重试。',
  'SYSMSG-NOT-SUPPORT-STORAGE': '当前浏览器设置不允许访问本地存储空间。',
  'SYSMSG-SERVICE-STATUS-400': '无效的请求。',
  'SYSMSG-SERVICE-STATUS-401': '当前请求需要用户验证。',
  'SYSMSG-SERVICE-STATUS-403': '远程服务拒绝执行。',
  'SYSMSG-SERVICE-STATUS-404': '请求所希望得到的资源未被在服务器上发现。'
};

/*  */
var Util = function Util () {};

Util.isProdunctionEnv = function isProdunctionEnv () {
  return process.env.NODE_ENV === 'production'
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

/**
 * 将所有可枚举属性的值从一个或多个源对象复制到目标对象
 *
 * @static
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object}
 * @memberof Util
 */
Util.assign = function assign (object) {
  return _.assign.apply(null, arguments)
};

var config = {
  $env: {},
  env: {
    dev: {},
    prod: {}
  },
  errorHanlder: null,
  message: {},
  router: {
    routes: []
  },
  auth: {
    storageMode: 'none'
  },
  storeSync: {}
};

// 取得配置文件
try {
  // 配置文件需与node_modules目录同级
  var customConfig = require(((process.env.SETARIA_CONFIG_CONTEXT || process.cwd()) + "/setaria.config.js"));
  if (customConfig !== undefined && customConfig !== null) {
    config = Util.assign({}, config, customConfig.default);
  }
  // 合并Setaria的系统错误
  config.message = Util.assign({}, MESSAGE, config.message);
} catch (e) {
}
// 加载CSS
// 根据环境设置env
var devEnv = Util.get(config, 'env.dev', {});
var prodEnv = Util.get(config, 'env.prod', {});
// 不区分环境的场合
if (Util.isEmpty(devEnv) && Util.isEmpty(prodEnv) && !Util.isEmpty(config.env)) {
  prodEnv = config.env;
}
// 保存原配置
config.$env = config.env;
// 生产环境的场合
if (Util.isProdunctionEnv()) {
  config.env = Util.assign({}, prodEnv);
// 开发环境的场合
} else {
  config.env = Util.assign({}, prodEnv, devEnv);
}

/*  */


var config$1 = config;

// import applyMixin from './mixin'

function install (_Vue) {
}

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
  return config$1.message ? config$1.message : {}
}

/**
 * 取得系统消息对象和自定义消息对象
 */
function getMessageObject () {
  return Util.assign({}, MESSAGE, getCustomMessageObject())
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
    this._name = 'ApplicationError';
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
/**
 * 判断是否为ApplicationError
 * @param {*} error
 */
function isApplicationError (error) {
  return typeof error === 'object' && error._name &&
    error._name === 'ApplicationError'
}

function parseApplicationError (error) {
  var ret = null;
  var id = '';
  var message = '';
  // ApplicationError对象
  if (isApplicationError(error)) {
    ret = new ApplicationError(error.id, [], error.noIdMessage);
  // Error对象
  } else if (error.message) {
    message = error.message;
    // 删除浏览器添加的错误信息前缀
    // firefox
    if (message.indexOf('Error: ') === 0) {
      message = message.replace('Error: ', '');
    // chrome, safari
    } else if (message.indexOf('Uncaught Error: ') === 0) {
      message = message.replace('Uncaught Error: ', '');
    }
    // 解析错误信息，取得错误代码和错误内容
    var msgArr = message.split(ERROR_MSG_SPLICER);
    id = msgArr[0].replace(ERROR_PREFIX, '').replace('[', '').replace(']', '');
    message = msgArr[1];
    ret = new ApplicationError(id, [], message);
  } else if (typeof error.toString === 'function') {
    ret = new ApplicationError(null, null, error.toString());
  } else {
    ret = new ApplicationError('MAM004E');
  }
  return ret
}

var ERROR_TYPES = {
  // 非Vue组件的常规错误
  'NORMAL_ERROR': 0,
  // Promise回调函数中的错误
  'PROMISE_UNREJECT_ERROR': 1,
  // 从 Vue 2.2.0 起，Vue组件生命周期钩子里的错误可以被捕获。
  // 从 Vue 2.4.0 起，Vue组件自定义事件句柄内部的错误可以被捕获。
  'VUE_ERROR': 2
};

var ErrorHandler = function ErrorHandler () {};

ErrorHandler.catchError = function catchError () {
  // Vue异常
  Vue.config.errorHandler = function (err, vm, info) {
    console.debug('The Exception from Vue');
    ErrorHandler.handleError(ERROR_TYPES.VUE_ERROR, err, {
      vm: vm,
      info: info
    });
  };
  // JavaScript执行期异常
  window.onerror = function (err) {
    console.debug('The Exception from window.onerror');
    ErrorHandler.handleError(ERROR_TYPES.NORMAL_ERROR, err, {});
  };

  // promise异常
  // 目前最新版的Firefox浏览器不支持PromiseRejectionEvent
  // Promise Rejection异常处理函数
  var unhandledrejectionHandler = function (err) {
    console.debug('The Exception from promise');
    ErrorHandler.handleError(ERROR_TYPES.PROMISE_UNREJECT_ERROR, err, {});
  };
  // 直接调用unhandledrejectionHandler的场合
  if (window.unhandledrejectionHandler === undefined ||
    window.unhandledrejectionHandler === null) {
    window.onunhandledrejection = unhandledrejectionHandler;
  }
  // 触发unhandledrejectionHandler的场合
  window.addEventListener('unhandledrejection', unhandledrejectionHandler);
};

/**
 * 处理捕获的异常
 */
ErrorHandler.handleError = function handleError (
  type,
  error,
  source) {
  // 取得异常内容
  var errorObject = this.parseError(type, error, source);
  if (typeof config$1.errorHanlder === 'function') {
    config$1.errorHanlder(errorObject, type, error, source);
  }
};

/**
 * 解析异常
 */
ErrorHandler.parseError = function parseError (
  type,
  error,
  source) {
  var ret = null;
  // 从Vue中抛出异常的场合
  if (type === ERROR_TYPES.VUE_ERROR) {
    ret = parseApplicationError(error);
  } else if (type === ERROR_TYPES.NORMAL_ERROR) {
    if (typeof error === 'string') {
      error = {
        message: error
      };
    }
    ret = parseApplicationError(error);
  // Promise回调函数中抛出的异常
  } else if (type === ERROR_TYPES.PROMISE_UNREJECT_ERROR) {
    ret = parseApplicationError(error.reason);
  } else {
    ret = new ApplicationError('MAM004E');
  }

  // 实现了Vue.config.errorHandler接口的场合，Vue不会在控制台显示错误。
  if (type === ERROR_TYPES.VUE_ERROR) {
    /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
    console.error(error);
  }
  return ret
};

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
    this._name = 'ApplicationError';
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

var config$2 = {
  sync: {}
};

// [Module]Common
var MODULE_SETARIA_STORE = '_setaria_common_';
// Getter
var _GET_IS_LOADING = '_setaria_get_is_loading';
var _GET_LOADING_COUNT = '_setaria_get_loading_count';
var _GET_ROUTE_HISTORY = '_setaria_get_route_history';
var _GET_ROUTE_CURRENT_INDEX = '_setaria_get_route_current_index';
var _GET_DIRECTION = '_setaria_get_direction';
// Mutation
var _SET_DIRECTION = '_setaria_set_direction';
var _ADD_LOADING_COUNT = '_setaria_add_loading_count';
var _SUB_LOADING_COUNT = '_setaria_sub_loading_count';
var _UPDATE_DIRECTION = '_setaria_update_direction';
var _UPDATE_ROUTE_HISTORY = '_setaria_update_route_history';
// Action

// [Module]Auth
var MODULE_AUTH = '_setaria_auth_';
// Getter
var _GET_USER = '_setaria_get_user';
var _GET_TOKEN = '_setaria_get_token';
// Mutation
var _SET_TOKEN = '_setaria_set_token';
var _SET_USER = '_setaria_set_user';
// Action

var types = {
  // Common
  MODULE_SETARIA_STORE: MODULE_SETARIA_STORE,
  GET_IS_LOADING: (MODULE_SETARIA_STORE + "/" + _GET_IS_LOADING),
  GET_LOADING_COUNT: (MODULE_SETARIA_STORE + "/" + _GET_LOADING_COUNT),
  GET_ROUTE_HISTORY: (MODULE_SETARIA_STORE + "/" + _GET_ROUTE_HISTORY),
  GET_ROUTE_CURRENT_INDEX: (MODULE_SETARIA_STORE + "/" + _GET_ROUTE_CURRENT_INDEX),
  GET_DIRECTION: (MODULE_SETARIA_STORE + "/" + _GET_DIRECTION),
  SET_DIRECTION: (MODULE_SETARIA_STORE + "/" + _SET_DIRECTION),
  ADD_LOADING_COUNT: (MODULE_SETARIA_STORE + "/" + _ADD_LOADING_COUNT),
  SUB_LOADING_COUNT: (MODULE_SETARIA_STORE + "/" + _SUB_LOADING_COUNT),
  UPDATE_DIRECTION: (MODULE_SETARIA_STORE + "/" + _UPDATE_DIRECTION),
  UPDATE_ROUTE_HISTORY: (MODULE_SETARIA_STORE + "/" + _UPDATE_ROUTE_HISTORY),
  MODULE_AUTH: MODULE_AUTH,
  // Auth
  GET_USER: (MODULE_SETARIA_STORE + "/" + MODULE_AUTH + "/" + _GET_USER),
  GET_TOKEN: (MODULE_SETARIA_STORE + "/" + MODULE_AUTH + "/" + _GET_TOKEN),
  SET_TOKEN: (MODULE_SETARIA_STORE + "/" + MODULE_AUTH + "/" + _SET_TOKEN),
  SET_USER: (MODULE_SETARIA_STORE + "/" + MODULE_AUTH + "/" + _SET_USER)
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
  var ret = null;
  try {
    ret = (scope === STORAGE_TYPE.LOCAL) ? window.localStorage : window.sessionStorage;
  } catch (error) {
    // 浏览器禁止Storage功能的场合
    throw new ApplicationError('SYSMSG-NOT-SUPPORT-STORAGE')
  }
  // 不支持localStorage和sessionStorage的场合
  if (ret === undefined) {
    throw new ApplicationError('SYSMSG-NOT-SUPPORT-STORAGE')
  }
  return ret
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

function checkScope (scope) {
  return Object.keys(STORAGE_TYPE).some(function (key) { return STORAGE_TYPE[key] === scope; })
}

/**
 * 在指定生命周期的Storage实例内进行设值
 */
function setItem (scope, key, value) {
  if (!checkScope(scope)) {
    return
  }
  var storageObject = getStorageObjectByScope(scope);
  storageObject[key] = value;
  setStorageObjectByScope(scope, storageObject);
}

/**
 * 在指定生命周期的Storage实例内进行取值
 */
function getItem (scope, key) {
  if (!checkScope(scope)) {
    return
  }
  return getStorageObjectByScope(scope)[key]
}

/**
 * 删除指定生命周期的Storage实例内的指定值
 * @param  {String} scope 生命期
 * @param  {String} key   键
 */
function removeItem (scope, key) {
  if (!checkScope(scope)) {
    return
  }
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

Storage.setItem = function setItem$1 (scope, key, value) {
  setItem(scope, key, value);
};
Storage.getItem = function getItem$1 (scope, key) {
  return getItem(scope, key)
};
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

/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 * @param {Array|Object} map
 * @return {Object}
 */
function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

var initStateValue = function (key, initialValue, syncObjectPath, scope) {
  var storageValue = Util.get(getSyncItem(scope, syncObjectPath), key);
  if (storageValue === undefined) {
    storageValue = initialValue;
  }
  return storageValue
};

var initState = function (states, objectPath, scope) {
  var ret = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    var initialValue = val;
    initialValue = initStateValue(key, val, objectPath, scope);
    ret[key] = initialValue;
  });
  return ret
};

var STORE_KEY_IN_STORAGE = '__setaria_store_sync';

var toObjectPath = function (path) { return path.replace(/\//g, '.'); };

var getStoreObjectFromStorage = function (scope) {
  var storeStorageObj = Storage.getItem(scope, STORE_KEY_IN_STORAGE);
  if (storeStorageObj === undefined || storeStorageObj === null) {
    storeStorageObj = {};
    Storage.setItem(scope, STORE_KEY_IN_STORAGE, storeStorageObj);
  }
  return storeStorageObj
};

var setSyncItem = function (scope, key, value) {
  var storeStorageObj = getStoreObjectFromStorage(scope);
  var item = Util.get(storeStorageObj, key, {});
  Util.assign(item, value);
  storeStorageObj[key] = item;
  Storage.setItem(scope, STORE_KEY_IN_STORAGE, storeStorageObj);
};

var getSyncItem = function (scope, key) {
  return getStoreObjectFromStorage(scope)[key]
};

var name$1 = MODULE_AUTH;
var syncObjectPath = MODULE_SETARIA_STORE + "/" + name$1;
if (config$1) {
  config$2.sync[syncObjectPath] = config$1.auth.storageMode;
}

// initial state
var state$1 = initState({
  _setaria_token: '',
  _setaria_user: null
}, syncObjectPath, config$1.auth.storageMode);

// getters
var getters$1 = {};
getters$1[_GET_USER] = function (state) { return state._setaria_user; };
getters$1[_GET_TOKEN] = function (state) { return state._setaria_token; };

// actions
var actions$1 = {
};

// mutations
var mutations$1 = {};
mutations$1[_SET_TOKEN] = function (stateObj, val) {
    var s = stateObj;
    s._setaria_token = val;
  };
mutations$1[_SET_USER] = function (stateObj, val) {
    var s = stateObj;
    s._setaria_user = val;
  };

var auth = {
  namespaced: true,
  name: name$1,
  state: state$1,
  getters: getters$1,
  actions: actions$1,
  mutations: mutations$1
};

var name = MODULE_SETARIA_STORE;

// initial state
var state = {
  _setaria_direction: '',
  _setaria_loading: 0,
  _setaria_routeHistory: {
    currentIndex: null,
    history: []
  }
};

// getters
var getters = {};
getters[_GET_ROUTE_HISTORY] = function (state) { return state._setaria_routeHistory; };
getters[_GET_ROUTE_CURRENT_INDEX] = function (state) { return state._setaria_routeHistory.currentIndex; };
getters[_GET_IS_LOADING] = function (state) { return state._setaria_loading !== 0; };
getters[_GET_LOADING_COUNT] = function (state) { return state._setaria_loading; };
getters[_GET_DIRECTION] = function (state) { return state._setaria_direction; };

// actions
var actions = {
};

// mutations
var mutations = {};
mutations[_SET_DIRECTION] = function (stateObj, val) {
    var s = stateObj;
    s._setaria_direction = val;
  };
mutations[_ADD_LOADING_COUNT] = function (stateObj) {
    var s = stateObj;
    s._setaria_loading += 1;
  };
mutations[_SUB_LOADING_COUNT] = function (stateObj) {
    var s = stateObj;
    if (s._setaria_loading > 0) {
      s._setaria_loading -= 1;
    }
  };
mutations[_UPDATE_DIRECTION] = function (stateObj, ref) {
    var current = ref.current;
    var next = ref.next;

    var direction = stateObj._setaria_direction;
    var routeHistory = stateObj._setaria_routeHistory;
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
      stateObj._setaria_direction = direction;
    }
  };
mutations[_UPDATE_ROUTE_HISTORY] = function (stateObj, ref) {
    var current = ref.current;
    var next = ref.next;

    var direction = stateObj._setaria_direction;
    var routeHistory = stateObj._setaria_routeHistory;
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
  };

var modules = {};
modules[auth.name] = auth;

var common = {
  namespaced: true,
  name: name,
  state: state,
  getters: getters,
  actions: actions,
  mutations: mutations,
  modules: modules
};

var storageSyncPlugin = function (store) {
  store.subscribe(function (ref, state) {
    var type = ref.type;
    var payload = ref.payload;

    Object.keys(config$2.sync).forEach(function (moduleKey) {
      // 根据定义进行同步
      if (type.indexOf(moduleKey) === 0) {
        var scope = config$2.sync[moduleKey];
        setSyncItem(scope, moduleKey, Util.get(state, toObjectPath(moduleKey)));
      }
    });
  });
};

var plugins = [storageSyncPlugin];

/*  */
var debug = process.env.NODE_ENV !== 'production';
var structure = {
  modules: ( obj = {}, obj[common.name] = common, obj ),
  plugins: plugins,
  strict: debug
};
var obj;

var storeInstance;

function createStore (Store) {
  // singleton
  if (storeInstance === null || storeInstance === undefined) {
    storeInstance = new Store(structure);
  }
  return storeInstance
}

function getStore () {
  return storeInstance
}

function registerModule (name, moduleObject, scope) {
  var module = moduleObject;
  if (scope) {
    module.state = initState(module.state, name, scope);
    config$2.sync[name] = scope;
  }
  storeInstance.registerModule(name, moduleObject);
}

/*  */
/**
 * 远程服务调用模块
 * @version 1.0
 * @author HanL
 */
var KEY_DEFAULTS_SETTING = 'defaults';

var ret = axios;

// Http Config
var httpConfig = Util.get(config$1, 'http');
// set default http config
var httpConfigDefault = Util.get(httpConfig, KEY_DEFAULTS_SETTING);
if (httpConfigDefault) {
  console.debug(httpConfigDefault);
  Object.keys(httpConfigDefault).forEach(function (key) {
    axios.defaults[key] = httpConfigDefault[key];
  });
}

// set custom http instance
var isCreateCustomHttpInstance = false;
if (httpConfig !== null && httpConfig !== undefined) {
  isCreateCustomHttpInstance = Object.keys(httpConfig).some(function (key) {
    if (key !== KEY_DEFAULTS_SETTING) {
      return true
    }
    return false
  });
  if (isCreateCustomHttpInstance) {
    ret = {};
    Object.keys(httpConfig).forEach(function (key) {
      var config = httpConfig[key];
      config.showLoading = true;
      ret[key] = axios.create(config);
      // add non-exist function to axios instance
      ret[key].all = axios.all;
      ret[key].spread = axios.spread;
    });
  }
}

// interceptor
// Tips: response interceptor will not be executed when got error
// loading interceptor
function addLoading (config) {
  var storeInstance = getStore();
  if (storeInstance && config.showLoading !== false) {
    storeInstance.commit(types.ADD_LOADING_COUNT);
  }
  return config
}
function subLoading (response) {
  var storeInstance = getStore();
  if (storeInstance && response.config.showLoading !== false) {
    storeInstance.commit(types.SUB_LOADING_COUNT);
  }
  return response
}

// error handler
function commonErrorHandler (error) {
  // sub loading state count
  subLoading({
    config: error.config
  });
  // server have response
  if (error.response) {
    console.debug('server have response', error);
    var messagePrefix = 'SYSMSG-SERVICE-STATUS-';
    var messageId = '';
    switch (error.response.status) {
      case 400:
        messageId = '400';
        break
      case 401:
        messageId = '401';
        break
      case 403:
        messageId = '403';
        break
      case 404:
        messageId = '404';
        break
      default:
        messageId = '';
    }
    var message = 'SYSMSG-SERVICE-UNKNOWN-ERROR';
    if (messageId !== '') {
      message = "" + messagePrefix + messageId;
    }
    throw new ServiceError(message, error)
  // The request was made but no response was received
  } else if (error.request) {
    console.debug('The request was made but no response was received', error);
  // Something happened in setting up the request that triggered an Error
  } else {
    console.debug('Something happened in setting up the request that triggered an Error', error);
    // timeout
    if (error.message.indexOf('timeout of ') === 0) {
      throw new ServiceError('SYSMSG-TIMEOUT', error, [error.config.timeout / 1000])
    // server unavaliable
    } else if (error.message.indexOf('Network Error') === 0) {
      throw new ServiceError('SYSMSG-SERVICE-NETWORK-ERROR', error)
    } else {
      throw new ServiceError('SYSMSG-SERVICE-UNKNOWN-ERROR', error)
    }
  }
  return Promise.reject(error)
}

// add interceptor to instance
if (typeof ret === 'function') {
  ret.interceptors.request.use(addLoading);
  ret.interceptors.response.use(subLoading, commonErrorHandler);
} else {
  Object.keys(ret).forEach(function (key) {
    ret[key].interceptors.request.use(addLoading);
    ret[key].interceptors.response.use(subLoading, commonErrorHandler);
  });
}

var Http = ret;

/*  */
Vue.use(Vuex);
var store = createStore(Vuex.Store);

function install$1 (Vue$$1) {
  if (install$1.installed) {
    return
  }
  install$1.installed = true;
  VueRouter.install(Vue$$1);
  Vue$$1.mixin({
    mounted: function mounted () {
      if (this.$store) {
        this.$store.commit(types.SET_DIRECTION, '');
      }
    }
  });
}

var updateDirection = function (to, from, next) {
  var params = to.params;
  var currentPageFullPath = from.fullPath;
  var direction = store.state[types.GET_DIRECTION];
  var nextPageFullPath = to.fullPath;
  if (params && params.$$direction === 'forward') {
    direction = 'forward';
    // 保存跳转方向
    store.commit(types.SET_DIRECTION, direction);
  }
  // 浏览器前进／后退按钮点击 或 点击了页面链接 的场合
  store.commit(types.UPDATE_DIRECTION, {
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
  store.commit(types.UPDATE_ROUTE_HISTORY, {
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
    // 注册默认全局守卫
    this.beforeEach(updateDirection);
    this.beforeEach(updateHistory);

    this.afterEach(function () {
      store.commit(types.SET_DIRECTION, '');
    });
  }

  if ( VueRouter$$1 ) Navigate.__proto__ = VueRouter$$1;
  Navigate.prototype = Object.create( VueRouter$$1 && VueRouter$$1.prototype );
  Navigate.prototype.constructor = Navigate;

  Navigate.prototype.forwardTo = function forwardTo (name, params, query) {
    if ( params === void 0 ) params = {};
    if ( query === void 0 ) query = {};

    store.commit(types.SET_DIRECTION, 'forward');
    if (Util.isObject(name)) {
      this.push(name);
    } else {
      this.push({
        name: name,
        params: params,
        query: query
      });
    }
  };

  Navigate.prototype.backTo = function backTo () {
    VueRouter$$1.prototype.back.call(this);
  };

  Navigate.prototype.back = function back () {
    store.commit(types.SET_DIRECTION, 'back');
    VueRouter$$1.prototype.back.call(this);
  };

  Navigate.prototype.forward = function forward () {
    store.commit(types.SET_DIRECTION, 'forward');
    VueRouter$$1.prototype.forward.call(this);
  };

  return Navigate;
}(VueRouter));

Navigate.install = install$1;
if (typeof window !== 'undefined') {
  Vue.use(Navigate);
}

// -- 环境变量设置
// 生产环境的场合
if (Util.isProdunctionEnv()) {
  // 不显示Vue日志和警告
  Vue.config.silent = true;
  // 不显示Vue产品信息
  Vue.config.productionTip = false;
}

// -- 加载路由组件
var router = new Navigate(config$1.router);

// -- 异常处理
ErrorHandler.catchError();

var index = {
  ApplicationError: ApplicationError,
  Http: Http,
  Message: Message,
  ServiceError: ServiceError,
  Storage: Storage,
  storageTypes: STORAGE_TYPE,
  config: config$1,
  install: install,
  plugin: {
    router: router,
    store: store
  },
  router: router,
  store: store,
  storeRegister: registerModule,
  storeTypes: types,
  util: Util,
  version: '0.2.11'
};

module.exports = index;
