/**
 * Setaria v0.4.2
 * (c) 2020 Ray Han
 * @license MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue'), require('axios'), require('ramda'), require('lodash'), require('vuex'), require('vue-router')) :
	typeof define === 'function' && define.amd ? define(['exports', 'vue', 'axios', 'ramda', 'lodash', 'vuex', 'vue-router'], factory) :
	(factory((global.Setaria = global.Setaria || {}),global.Vue,global.axios,global.R,global._,global.Vuex,global.VueRouter));
}(this, (function (exports,Vue,axios,R,_,Vuex,VueRouter) { 'use strict';

Vue = 'default' in Vue ? Vue['default'] : Vue;
axios = 'default' in axios ? axios['default'] : axios;
_ = 'default' in _ ? _['default'] : _;
Vuex = 'default' in Vuex ? Vuex['default'] : Vuex;
VueRouter = 'default' in VueRouter ? VueRouter['default'] : VueRouter;

/*  */



var config = ({
  /**
   * Error Handler
   */
  errorHandler: null,

  /**
   * Message Resource
   */
  message: null,

  /**
   * Http Config
   */
  http: null,

  /**
   * Vue Router Option
   */
  routes: null,

  /**
   * Vuex Store Option
   */
  store: null,

  /**
   * Vuex Store Scope Key
   * The key which be used for define module sync scope(session or local)
   */
  storeScopeKey: 'scope',

  vpnKey: '/prx/000',

  excludeRecordPageLoadTimeComponentName: ['app'],

  /**
   * Log Handler
   * @param pageName
   * @param type
   * @param elapseTime
   * @param vm
   */
  logHandler: null,

  /**
   * 是否记录日志（通过Request Header将日志相关字段提交至后端进行记录）
   */
  log: false,

  /**
   * 模块URL映射规则，用于配置工程子模块url与模块属性的映射关系
   */
  moduleUrlRules: null
});

function merge$1 (obj1, obj2) {
  return R.merge(obj1, obj2)
}

function mergeDeepRight$1 (obj1, obj2) {
  return R.mergeDeepRight(obj1, obj2)
}

function pathOr$1 (defaultValue, path, obj) {
  return R.pathOr(defaultValue, path, obj)
}

function propOr$1 (defaultValue, key, obj) {
  return R.propOr(defaultValue, key, obj)
}

function findIndex$1 (list, fn) {
  return R.findIndex(fn)(list)
}

function keys (val) {
  return _.keys(val)
}

function isNotEmpty (val) {
  if (typeof val === 'number') {
    return true
  }
  if (val === null || val === undefined) {
    return false
  }
  return !R.isEmpty(val)
}

function isEmpty$1 (val) {
  return !isNotEmpty(val)
}

function isArray (val) {
  return _.isArray(val)
}

function clone$1 (val) {
  return R.clone(val)
}

function trim$1 (val) {
  return R.trim(val)
}

/**
 * 检查列表/字符串是否以给定的值开头。
 */
function startsWith$1 (char, val) {
  return R.startsWith(char, val)
}

/**
 * 检查列表是否以指定的子列表结尾。
 * 同样的，检查字符串是否以指定的子字符串结尾。
 */
function endsWith$1 (char, val) {
  return R.endsWith(char, val)
}

/**
 * 转换成驼峰命名
 *
 * @export
 * @param {*} val
 * @returns
 */
function camelCase (val) {
  return _.camelCase(val)
}

/**
 * 将字符转换成kebab命名
 *
 * @export
 * @param {*} val
 * @returns
 */
function kebabCase (val) {
  return _.kebabCase(val)
}

// Module
// Common
var SETARIA_SDK_STORE_MODULE = '_setaria_common_';
var SETARIA_SDK_STORE_MODULE_SYSTEM_CONFIG = 'systemConfig';

// Getter
var _GETTER = {
  '_GET_INITIAL_STATE': '_setaria_initial_state',
  '_GET_IS_LOADING': '_setaria_get_is_loading',
  '_GET_LOADING_COUNT': '_setaria_get_loading_count',
  '_GET_ROUTE_HISTORY': '_setaria_get_route_history',
  '_GET_ROUTE_CURRENT_INDEX': '_setaria_get_route_current_index',
  '_GET_TARGET_ROUTE': '_setaria_get_target_route',
  '_GET_DIRECTION': '_setaria_get_direction',
  '_GET_FROM_PAGE_TYPE': '_setaria_get_from_page_type',
  '_GET_LASTEST_TRACK': '_setaria_get_lastest_track',
  '_GET_TRACK_LIST': '_setaria_get_track_list',
  '_GET_TODO_REDIRECT_URL': '_setaria_get_todo_redirect_url',
  '_GET_PAGE_FULL_NAME': 'setaria_get_page_full_name',
  '_GET_PAGE_SINGLE_NAME': 'setaria_get_page_single_name',
  '_GET_PREV_PAGE_TRACK': 'setaria_get_prev_page_track',
  '_GET_CURRENT_PAGE_MODULE': 'setaria_get_current_page_module',
  '_GET_CURRENT_REQUEST_ID': 'setaria_get_current_request_id',
  '_GET_CURRENT_ODD_NUMBER': 'setaria_get_current_odd_number',
  '_GET_DEBUG_REQUEST_LIST': 'setaria_get_debug_request_list'

};
// Mutation
var _MUTATION = {
  '_SET_DIRECTION': '_setaria_set_direction',
  '_ADD_LOADING_COUNT': '_setaria_add_loading_count',
  '_SUB_LOADING_COUNT': '_setaria_sub_loading_count',
  '_UPDATE_DIRECTION': '_setaria_update_direction',
  '_UPDATE_ROUTE_HISTORY': '_setaria_update_route_history',
  '_SET_FROM_PAGE_TYPE': '_setaria_set_from_page_type',
  '_SET_FROM_PAGE_NAME': '_setaria_set_from_page_name',
  '_ADD_TRACK': '_setaria_add_track',
  '_UPDATE_CURRENT_PAGE_MODULE': '_setaria_update_current_page_module',
  '_ADD_ERROR': '_setaria_add_error',
  '_SET_INITIAL_STATE': '_setaria_initial_state',
  '_SET_PAGE_MODULE': '_setaria_set_page_module',
  '_SET_REQUEST_ID': '_setaria_request_id',
  '_SET_ODD_NUMBER': '_setaria_odd_number',
  '_SET_DEBUG_REQUEST_LIST': '_setaria_set_debug_request_list',
  '_CLEAR_DEBUG_REQUEST_LIST': '_setaria_clear_debug_request_list'
};

var STORE_KEY = {
  // Common
  SETARIA_SDK_STORE_MODULE: SETARIA_SDK_STORE_MODULE,
  // Getters
  GET_INITIAL_STATE: (SETARIA_SDK_STORE_MODULE + "/" + (_GETTER._GET_INITIAL_STATE)),
  GET_IS_LOADING: (SETARIA_SDK_STORE_MODULE + "/" + (_GETTER._GET_IS_LOADING)),
  GET_LOADING_COUNT: (SETARIA_SDK_STORE_MODULE + "/" + (_GETTER._GET_LOADING_COUNT)),
  GET_ROUTE_HISTORY: (SETARIA_SDK_STORE_MODULE + "/" + (_GETTER._GET_ROUTE_HISTORY)),
  GET_ROUTE_CURRENT_INDEX: (SETARIA_SDK_STORE_MODULE + "/" + (_GETTER._GET_ROUTE_CURRENT_INDEX)),
  GET_TARGET_ROUTE: (SETARIA_SDK_STORE_MODULE + "/" + (_GETTER._GET_TARGET_ROUTE)),
  GET_DIRECTION: (SETARIA_SDK_STORE_MODULE + "/" + (_GETTER._GET_DIRECTION)),
  GET_FROM_PAGE_TYPE: (SETARIA_SDK_STORE_MODULE + "/" + (_GETTER._GET_FROM_PAGE_TYPE)),
  GET_FROM_PAGE_NAME: (SETARIA_SDK_STORE_MODULE + "/" + (_GETTER._GET_FROM_PAGE_NAME)),
  GET_TRACK_LIST: (SETARIA_SDK_STORE_MODULE + "/" + (_GETTER._GET_TRACK_LIST)),
  GET_LASTEST_TRACK: (SETARIA_SDK_STORE_MODULE + "/" + (_GETTER._GET_LASTEST_TRACK)),
  GET_PAGE_FULL_NAME: (SETARIA_SDK_STORE_MODULE + "/" + (_GETTER._GET_PAGE_FULL_NAME)),
  GET_PAGE_SINGLE_NAME: (SETARIA_SDK_STORE_MODULE + "/" + (_GETTER._GET_PAGE_SINGLE_NAME)),
  GET_PREV_PAGE_TRACK: (SETARIA_SDK_STORE_MODULE + "/" + (_GETTER._GET_PREV_PAGE_TRACK)),
  GET_LASTEST_ERROR: (SETARIA_SDK_STORE_MODULE + "/" + (_GETTER._GET_LASTEST_ERROR)),
  GET_CURRENT_ODD_NUMBER: (SETARIA_SDK_STORE_MODULE + "/" + (_GETTER._GET_CURRENT_ODD_NUMBER)),
  GET_CURRENT_REQUEST_ID: (SETARIA_SDK_STORE_MODULE + "/" + (_GETTER._GET_CURRENT_REQUEST_ID)),
  GET_CURRENT_PAGE_MODULE: (SETARIA_SDK_STORE_MODULE + "/" + (_GETTER._GET_CURRENT_PAGE_MODULE)),
  GET_DEBUG_REQUEST_LIST: (SETARIA_SDK_STORE_MODULE + "/" + (_GETTER._GET_DEBUG_REQUEST_LIST)),
  // Getters - SytemConfig
  GET_TODO_REDIRECT_URL: (SETARIA_SDK_STORE_MODULE_SYSTEM_CONFIG + "/" + (_GETTER._GET_TODO_REDIRECT_URL)),
  // Mutations
  SET_INITIAL_STATE: (SETARIA_SDK_STORE_MODULE + "/" + (_MUTATION._SET_INITIAL_STATE)),
  SET_DIRECTION: (SETARIA_SDK_STORE_MODULE + "/" + (_MUTATION._SET_DIRECTION)),
  ADD_LOADING_COUNT: (SETARIA_SDK_STORE_MODULE + "/" + (_MUTATION._ADD_LOADING_COUNT)),
  SUB_LOADING_COUNT: (SETARIA_SDK_STORE_MODULE + "/" + (_MUTATION._SUB_LOADING_COUNT)),
  UPDATE_DIRECTION: (SETARIA_SDK_STORE_MODULE + "/" + (_MUTATION._UPDATE_DIRECTION)),
  UPDATE_ROUTE_HISTORY: (SETARIA_SDK_STORE_MODULE + "/" + (_MUTATION._UPDATE_ROUTE_HISTORY)),
  SET_FROM_PAGE_TYPE: (SETARIA_SDK_STORE_MODULE + "/" + (_MUTATION._SET_FROM_PAGE_TYPE)),
  SET_FROM_PAGE_NAME: (SETARIA_SDK_STORE_MODULE + "/" + (_MUTATION._SET_FROM_PAGE_NAME)),
  ADD_TRACK: (SETARIA_SDK_STORE_MODULE + "/" + (_MUTATION._ADD_TRACK)),
  ADD_ERROR: (SETARIA_SDK_STORE_MODULE + "/" + (_MUTATION._ADD_ERROR)),
  SET_PAGE_MODULE: (SETARIA_SDK_STORE_MODULE + "/" + (_MUTATION._SET_PAGE_MODULE)),
  SET_REQUEST_ID: (SETARIA_SDK_STORE_MODULE + "/" + (_MUTATION._SET_REQUEST_ID)),
  SET_ODD_NUMBER: (SETARIA_SDK_STORE_MODULE + "/" + (_MUTATION._SET_ODD_NUMBER)),
  UPDATE_CURRENT_PAGE_MODULE: (SETARIA_SDK_STORE_MODULE + "/" + (_MUTATION._UPDATE_CURRENT_PAGE_MODULE)),
  SET_DEBUG_REQUEST_LIST: (SETARIA_SDK_STORE_MODULE + "/" + (_MUTATION._SET_DEBUG_REQUEST_LIST)),
  CLEAR_DEBUG_REQUEST_LIST: (SETARIA_SDK_STORE_MODULE + "/" + (_MUTATION._CLEAR_DEBUG_REQUEST_LIST)),
  // Mutations - SytemConfig
  LOGOUT_URL: (SETARIA_SDK_STORE_MODULE_SYSTEM_CONFIG + "/logoutUrl"),
  // Actions
  ACTION_FETCH_USER_INFO: (SETARIA_SDK_STORE_MODULE_SYSTEM_CONFIG + "/fetchUserInfo")
};

/**
 * Storage生命期类型
 * @type {Object}
 */
var STORAGE_TYPE = {
  LOCAL: 'local',
  SESSION: 'session'
};

var MESSAGE_TYPE = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error'
};

var ERROR_PREFIX = 'Setaria Error';

var ERROR_MSG_SPLICER = '_$:$_';

var ERROR_THROW_TYPES = {
  // 非Vue组件的常规错误
  'NORMAL_ERROR': 0,
  // Promise回调函数中的错误
  'PROMISE_UNREJECT_ERROR': 1,
  // 从 Vue 2.2.0 起，Vue组件生命周期钩子里的错误可以被捕获。
  // 从 Vue 2.4.0 起，Vue组件自定义事件句柄内部的错误可以被捕获。
  'VUE_ERROR': 2
};

var LAST_PAGE_NAME = '__last_page_name';

var API_RESPOSNE_CODE_TYPES = {
  'SUCCESS': '00000'
};

var ROUTER_SESSION_STORAGE_QUERY_KEY_PREFIX = 'ROUTER_SESSION_STORAGE';

// 日志类型
var LOG_TYPE = {
  // 用户登录
  LOGIN: '0',
  // 填单
  CREATE: '1',
  // 审批
  APPROVAL: '2',
  // 查看
  VIEW: '3',
  // 查询
  SEARCH: '4',
  // 修改
  UPDATE: '5',
  // 用户注销
  LOGOUT: '6',
  // 转单
  TRANSFER: '7',
  // 页面加载
  PAGE_LOAD: '8'
};

var constants = {
  ERROR_THROW_TYPES: ERROR_THROW_TYPES,
  ERROR_PREFIX: ERROR_PREFIX,
  ERROR_MSG_SPLICER: ERROR_MSG_SPLICER,
  MESSAGE_TYPE: MESSAGE_TYPE,
  STORE_KEY: STORE_KEY,
  STORAGE_TYPE: STORAGE_TYPE,
  ROUTER_SESSION_STORAGE_QUERY_KEY_PREFIX: ROUTER_SESSION_STORAGE_QUERY_KEY_PREFIX,
  LOG_TYPE: LOG_TYPE,
  LAST_PAGE_NAME: LAST_PAGE_NAME
};

function encodeErrorMessage (prefix, code, message, showType) {
  return (prefix + "[" + code + "]" + ERROR_MSG_SPLICER + "{" + showType + "}" + ERROR_MSG_SPLICER + message)
}

/*  */
var AbstractError = (function (Error) {
  function AbstractError (errorCode, errorMessage, className, showType) {
    if ( errorCode === void 0 ) errorCode = '';
    if ( errorMessage === void 0 ) errorMessage = '';
    if ( className === void 0 ) className = '';
    if ( showType === void 0 ) showType = 2;

    var encodeMessage = encodeErrorMessage(ERROR_PREFIX, errorCode, errorMessage, showType);
    Error.call(this, encodeMessage);
    this._name = className || 'AbstractError';
    this.type = MESSAGE_TYPE.ERROR;
    this.showType = showType;
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
  }

  if ( Error ) AbstractError.__proto__ = Error;
  AbstractError.prototype = Object.create( Error && Error.prototype );
  AbstractError.prototype.constructor = AbstractError;

  return AbstractError;
}(Error));

/*  */
var Message = function Message (id, params, message) {
  if ( id === void 0 ) id = '';
  if ( params === void 0 ) params = [];
  if ( message === void 0 ) message = '';

  this.id = id;
  this.type = getMessageType(id);
  this.params = params;
  this.message = formatMessage(this.id, this.params);
  if (isEmpty$1(this.message) && !isEmpty$1(message)) {
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

/**
 * 根据消息ID取得对应的消息
 */
function getMessageById (id) {
  var message = config.message || {};
  return message[id]
}

/**
 * 格式化指定消息
 */
function formatMessage (id, params) {
  if ( id === void 0 ) id = '';
  if ( params === void 0 ) params = [];

  var message = getMessageById(id);
  var ret = (message === null || message === undefined) ? '' : message;
  if (!isEmpty$1(ret) && !isEmpty$1(params)) {
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
      ret = 'info';
      break
    case 'S':
      ret = 'success';
      break
    default:
      ret = 'info';
  }
  return ret
}

/*  */



var ApplicationError = (function (AbstractError$$1) {
  function ApplicationError (messageCode, params, message, showType) {
    if ( messageCode === void 0 ) messageCode = '';
    if ( params === void 0 ) params = [];
    if ( message === void 0 ) message = '';
    if ( showType === void 0 ) showType = 2;

    var msg = message;
    // 生产环境屏蔽javascript执行期错误
    if (isEmpty$1(messageCode) && "development" === 'production') {
      console.error(msg);
      messageCode = 'SYSMSG-CLIENT-UNKNOWN-ERROR';
      msg = '';
    }
    if (!isEmpty$1(messageCode) && isEmpty$1(msg)) {
      msg = new Message(messageCode, params, msg).getMessage() || new Message('SYSMSG-CLIENT-UNKNOWN-ERROR').getMessage();
    }
    // 从window.onerror只能取得字符串类型的错误信息
    AbstractError$$1.call(this, messageCode, msg, 'ApplicationError', showType);
    this.messageCode = messageCode;
    this.params = params;
  }

  if ( AbstractError$$1 ) ApplicationError.__proto__ = AbstractError$$1;
  ApplicationError.prototype = Object.create( AbstractError$$1 && AbstractError$$1.prototype );
  ApplicationError.prototype.constructor = ApplicationError;

  return ApplicationError;
}(AbstractError));

/**
 * 埋点数据实体
 */
var TrackDto = function TrackDto (componentName, componentLabel, eventName, pageName, prevPageName, querys) {
  // 页面名称（中文）
  this.pageName = pageName;
  // 组件名称（英文）
  this.componentName = componentName;
  // 组件名称（中文）
  this.componentLabel = componentLabel;
  // 事件名称（英文）
  this.eventName = eventName;
  // 前页面名称（中文）
  this.prevPageName = prevPageName;
  // 当前页面url中的queryparameter对象
  this.querys = querys;
};

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };



function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null;
  return res ? ("?" + res) : ''
}

function push (router, originFunction) {
  return function (location, onComplete, onAbort) {
    if ( location === void 0 ) location = {};

    // 因设置了path的场合，params会被无视，所以通过url query string传递跳转方向(前进/后退)
    if (typeof location.path === 'string') {
      if (typeof location.query === 'object') {
        location.query._direction = 'forward';
      } else {
        location.query = {
          _direction: 'forward'
        };
      }
    } else if (typeof location.params === 'object') {
      // 设置了_direction的场合，使用设置的值
      if (!isNotEmpty(location.params._direction)) {
        location.params._direction = 'forward';
      }
    } else {
      location.params = {
        _direction: 'forward'
      };
    }
    // 跨模块跳转支持 query 参数内复杂参数的传递
    if (location.global) {
      router.generateModuleParams(location);
      // vue-router的push函数在iframe下跳转有问题，因此需要使用原生api进行iframe下的页面跳转
      // 根据路由信息取得目标跳转URL
      var path =
        location.path.indexOf('/') !== 0 ? ("/" + (location.path)) : location.path;
      var query = location.query ? stringifyQuery(location.query) : '';
      var baseUrl = router.options.base;
      var href = "" + baseUrl + path + query;
      window.location.href = href;
    } else {
      originFunction.call(router, location, onComplete, onAbort);
    }
  }
}

function push$1 (router, originFunction) {
  return function (location, onComplete, onAbort) {
    // 用于记录路由历史
    if (typeof location.params === 'object') {
      location.params._direction = 'replace';
    } else {
      location.params = {
        _direction: 'replace'
      };
    }
    originFunction.call(router, location, onComplete, onAbort);
  }
}

var updateDirection = function (to, from, next) {
  var store = getStore();
  var params = to.params;
  var query = to.query;
  var currentPageFullPath = from.fullPath;
  var direction = '';
  var nextPageFullPath = to.fullPath;
  // 设置了path的场合，params会被无视
  if (query && typeof query._direction === 'string') {
    direction = query._direction;
  } else if (params && params._direction) {
    direction = params._direction;
  }
  // 保存跳转方向
  store.commit(STORE_KEY.SET_DIRECTION, direction);
  // 浏览器前进／后退按钮点击 或 点击了页面链接 的场合
  store.commit(STORE_KEY.UPDATE_DIRECTION, {
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
  var store = getStore();
  var payload = {
    current: {
      url: from.fullPath,
      meta: from.meta,
      originRouteObject: from
    },
    next: {
      url: to.fullPath,
      meta: to.meta,
      originRouteObject: to
    }
  };
  store.commit(STORE_KEY.UPDATE_ROUTE_HISTORY, payload);
  next();
};

/*  */
var STORAGE_KEY = '__Setaria_SDK_Storage_';



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

/*  */
function getWindowLocation (isTop) {
  var targetWindow = window;
  if (isTop && targetWindow !== window.top) {
    targetWindow = window.top;
  }
  return targetWindow.location
}

var decode$1 = decodeURIComponent;

function parseQuery$1 (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode$1(parts.shift());
    var val = parts.length > 0
      ? decode$1(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

/**
 * 取得指定query parameter的值
 */
function getQueryParameter (key, isTop) {
  // 取得当前window对象的location
  var location = getWindowLocation(isTop) || {};
  var ref = location || '';
  var search = ref.search;
  var queryParameters = parseQuery$1(search) || {};
  return queryParameters[key]
}

/**
 * 关闭当前窗口
 */


/**
 * 根据url和query属性生成保存在Storage里的key值
 */
function generateStorageKeyByUrlQueryAttribute (url, queryKey) {
  return (ROUTER_SESSION_STORAGE_QUERY_KEY_PREFIX + "_" + url + "_" + queryKey + "_" + (Math.floor(Math.random() * 1000000000)))
}

/**
 * 是否存在保存在Storage内的key
 *
 * @export
 * @param {string} key
 */
function isStorageKeyExistInQueryParameter (key) {
  if (typeof key === 'string' && isNotEmpty(key)) {
    return key.indexOf(ROUTER_SESSION_STORAGE_QUERY_KEY_PREFIX) === 0
  }
  return false
}

/**
 * 保存复杂类型的值
 *
 * @export
 * @param {string} key
 * @param {*} value
 */
function setQueryValueByStorageKey (key, value) {
  Storage.setSessionItem(key, value);
}

/**
 * 取得指定复杂类型的值
 *
 * @export
 * @param {string} key
 */
function getQueryValueByStorageKey (key) {
  return Storage.getSessionItem(key)
}

/**
 * 当前环境是否支持history.state
 */
function supportsPushState () {
  var ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
}

/*  */
var router;

// scrollBehavior:
// - only available in html5 history mode
// - defaults to no scroll behavior
// - return false to prevent scroll
var defaultScrollBehavior = function (to, from, savedPosition) {
  if (savedPosition) {
    // savedPosition is only available for popstate navigations.
    return savedPosition
  } else {
    var position = {};

    // return new Promise(resolve => {
    // check if any matched route config has meta that requires scrolling to top
    var index = findIndex$1(to.matched, function (m) { return m.meta.scrollToTop; });
    var selector = null;
    if (index !== -1) {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      selector = to.matched[index].meta.selector;
      if (typeof selector === 'string') {
        if (document.querySelector(selector).scrollTo) {
          document.querySelector(selector).scrollTo(0, 0);
        } else {
          document.querySelector(selector).scrollTop = 0;
        }
        return false
      }
    }

    return new Promise(function (resolve) {
      if (selector === null) {
        position.x = 0;
        position.y = 0;
        resolve(position);
      }
    })
    // resolve(position)
    // // wait for the out transition to complete (if necessary)
    // this.app.$root.$once('triggerScroll', () => {
    //   // if the resolved position is falsy or an empty object,
    //   // will retain current scroll position.
    //   resolve(position)
    // })
    // })
  }
};

var getRouterBase = function (router) {
  var base = router.options.base;
  if (base.indexOf('/') !== 0) {
    base = "/" + base;
  }
  if (base.charAt(base.length - 1) === '/') {
    base = base.substring(0, base.length - 1);
  }
  return base
};

function install$3 (Vue$$1, options) {
  console.debug('router install');
  // 安装VueRouter
  Vue$$1.use(VueRouter);
  if (config.routes) {
    var ref = config.routes;
    var routes = ref.routes;
    var scrollBehavior = ref.scrollBehavior;
    // 没有设置scrollBehavior的场合，使用默认scrollBehavior
    if (scrollBehavior === undefined || scrollBehavior === null) {
      config.routes.scrollBehavior = defaultScrollBehavior;
    }
    if (routes && routes.length > 0) {
      // 404
      if (routes[routes.length - 1]) {
        var lastestRoute = routes[routes.length - 1];
        // 没有定义404页面的且使用html5 history模式的场合，添加全局默认404页面
        if (config.routes.mode === 'history' && lastestRoute.path !== '*') {
          routes.push({
            path: '*',
            component: { template: '<div>404</div>' }
          });
        }
      }
    }
  }
  // 创建Vue Router实例
  router = new VueRouter(config.routes);
  // 从url parameter中取得&保存系统信息
  router.beforeEach(function (to, from, next) {
    // 保存非SPA前页面信息
    var lastPageName = getQueryParameter(constants.LAST_PAGE_NAME);
    if (isNotEmpty(lastPageName)) {
      getStore().commit(constants.STORE_KEY.SET_FROM_PAGE_NAME, lastPageName);
    }
    next();
  });
  // 更新跳转方向（前进/后退）
  router.beforeEach(updateDirection);
  // 添加页面浏览历史
  router.beforeEach(updateHistory);
  // 埋点增加页面初始化操作
  router.beforeEach(function (to, from, next) {
    var base = router.options.base;
    if (!isNotEmpty(base)) {
      next();
      return
    }
    base = getRouterBase(router);
    var pathname = "" + base + (to.path);
    getStore().commit(constants.STORE_KEY.UPDATE_CURRENT_PAGE_MODULE, pathname);
    var fromRouteTitle = from && from.meta ? from.meta.title : '';
    var toRouteTitle = to && to.meta ? to.meta.title : '';
    var trackDto = new TrackDto('', '', 'init', toRouteTitle, fromRouteTitle, to.query);
    getStore().commit(constants.STORE_KEY.ADD_TRACK, trackDto);
    var currentPageName = getStore().getters[constants.STORE_KEY.GET_CURRENT_PAGE_MODULE] || [];
    currentPageName = currentPageName.map(function (item) { return item.label; }).concat(toRouteTitle).join(',');
    console.log('当前页面[pageName]:', currentPageName);
    next();
  });
  // 模块间跳转时，可能存在需要传递大量参数的场景，此时跳转前值会存入SessionStorage，执行跳转动作后，在此处判断Storage内是否存在保存的query值
  router.beforeEach(function (to, from, next) {
    // 模块首次渲染的场合
    if (to.query) {
      keys(to.query).forEach(function (queryKey) {
        var queryValue = to.query[queryKey];
        // 存在query专有key，之前保存时框架会加入前缀
        if (isStorageKeyExistInQueryParameter(queryValue)) {
          var val = getQueryValueByStorageKey(queryValue);
          if (val) {
            to.query[queryKey] = val;
          }
        }
      });
    }
    next();
  });
  // 同步用户信息
  router.beforeEach(function (to, from, next) {
    var store = getStore();
    store.dispatch(constants.STORE_KEY.ACTION_FETCH_USER_INFO)
      .then(function () {
        next();
      })
      .catch(function () {
        // 开发环境的场合
        {
          next();
        }
      });
  });
  var originPushFunction = router.push;
  var originReplaceFunction = router.replace;
  // 覆写push函数，实现路由历史记录，四期模块间和跳转至三期页面，通过tab页打开目标页面的功能
  router.push = push(router, originPushFunction);
  // 覆写replace函数，实现路由历史记录功能
  router.replace = push$1(router, originReplaceFunction);
  // 当页面被iframe加载且浏览器网页上存在多个iframe时，iframe内页面的跳转会被vue-router通过记录到
  if (window.top !== window && supportsPushState()) {
    window.history.pushState = function (state, title, url) {
      // console.log(state, title, url)
    };
    window.history.go = function (index) {
      try {
        var targetRoute = getStore().getters[constants.STORE_KEY.GET_TARGET_ROUTE](index);
        if (targetRoute) {
          var originRouteObject = targetRoute.originRouteObject;
          if (originRouteObject) {
            originRouteObject;
            var name = originRouteObject.name;
            var query = originRouteObject.query;
            var params = originRouteObject.params; if ( params === void 0 ) params = {};
            params._direction = 'back';
            getRouter().push({
              name: name,
              query: query,
              params: params
            });
          } else {
            router.close();
          }
        } else {
          router.close();
        }
      } catch (err) {
        throw new ApplicationError('SYSMSG-ROUTE-NOT-EXIST')
      }
    };
  }

  /**
   * 手动生产跨模块间的传参
   * @params location 跳转对象路由信息
  */
  router.generateModuleParams = function (location) {
    if (location.query && typeof location.query === 'object') {
      keys(location.query).forEach(function (key) {
        if (location.query[key] !== null &&
          (typeof location.query[key] === 'object' || isArray(location.query[key]))) {
          var newKey = generateStorageKeyByUrlQueryAttribute(location.path, key);
          // 因浏览器对于url长度的限制(IE:2083, Chrome:8182)，复杂数据将放入SessionStorage保存
          setQueryValueByStorageKey(newKey, location.query[key]);
          location.query[key] = newKey;
        }
      });
    }
    return location
  };
}

function getRouter () {
  return router
}

// initial state
var state = {
  // 自定义初始化数据
  _setaria_initial_state: {
    data: null,
    error: null
  },
  _setaria_direction: '',
  _setaria_loading: 0,
  _setaria_routeHistory: {
    currentIndex: null,
    history: []
  },
  _setaria_from_page_type: '',
  _setaria_from_page_name: '',
  _setaria_track_history: [],
  _setaria_error_history: [],
  _setaria_page_module_list: [],
  _setaria_current_page_module: [],
  _setaria_request_id: '',
  _setaria_odd_number: '',
  _setaria_debug_request_list: []
};

function getRouteHistory (state) {
  var routeHistory = state._setaria_routeHistory;
  var currentIndex = routeHistory.currentIndex; if ( currentIndex === void 0 ) currentIndex = 0;
  var history = routeHistory.history; if ( history === void 0 ) history = [];
  if (history.length > currentIndex) {
    return currentIndex === 0 ? history.slice(0, 1) : history.slice(0, currentIndex + 1)
  }
  return history
}

function getPageName (state, isSingleName, separator) {
  var pageName = '';
  // 否则从路由中取得当前页面名称
  var router = getRouter();
  if (router && router.history) {
    var currentRouter = router.history.current;
    if (currentRouter) {
      pageName = currentRouter.meta && currentRouter.meta.title || currentRouter.name;
    }
  }
  return pageName
}

// getters
var getters = {};
getters[_GETTER._GET_INITIAL_STATE] = function (state) { return state._setaria_initial_state; };
getters[_GETTER._GET_ROUTE_HISTORY] = function (state) {
    return getRouteHistory(state)
  };
getters[_GETTER._GET_ROUTE_CURRENT_INDEX] = function (state) { return state._setaria_routeHistory.currentIndex; };
getters[_GETTER._GET_TARGET_ROUTE] = function (state) { return function (index) { return state._setaria_routeHistory.history[state._setaria_routeHistory.currentIndex + index]; }; };
getters[_GETTER._GET_IS_LOADING] = function (state) { return state._setaria_loading !== 0; };
getters[_GETTER._GET_LOADING_COUNT] = function (state) { return state._setaria_loading; };
getters[_GETTER._GET_DIRECTION] = function (state) { return state._setaria_direction; };
getters[_GETTER._GET_FROM_PAGE_TYPE] = function (state) { return state._setaria_from_page_type; };
getters[_GETTER._GET_FROM_PAGE_NAME] = function (state) { return state._setaria_from_page_name; };
getters[_GETTER._GET_PAGE_FULL_NAME] = function (state, getters) { return function (seprator) {
    return getPageName(state, false, seprator)
  }; };
getters[_GETTER._GET_PAGE_SINGLE_NAME] = function (state, getters) { return getPageName(state, true); };
getters[_GETTER._GET_TRACK_LIST] = function (state, getters) {
    return state._setaria_track_history
  };
getters[_GETTER._GET_LASTEST_TRACK] = function (state, getters) {
    if (state._setaria_track_history && state._setaria_track_history.length > 0) {
      return state._setaria_track_history[state._setaria_track_history.length - 1]
    }
    return null
  };
getters[_GETTER._GET_PREV_PAGE_TRACK] = function (state, getters) { return function (currentPageName) {
    var historyList = state._setaria_track_history || [];
    if (historyList.length === 0 || !isNotEmpty(currentPageName)) {
      return null
    }
    var index = -1;
    // 取得当前页的init事件记录
    for (var i = historyList.length - 1; i >= 0; i--) {
      var item = historyList[i];
      if (item.pageName === currentPageName && item.eventName === 'init') {
        index = i;
        break
      }
    }
    // 没有前页面的场合
    if (index === -1 || index === 0) {
      return null
    }
    return historyList[index - 1]
  }; };
getters[_GETTER._GET_LASTEST_ERROR] = function (state) {
    if (state._setaria_error_history && state._setaria_error_history.length > 0) {
      return state._setaria_error_history[state._setaria_error_history.length - 1]
    }
    return null
  };
getters[_GETTER._GET_CURRENT_PAGE_MODULE] = function (state) {
    return state._setaria_current_page_module
  };
getters[_GETTER._GET_CURRENT_REQUEST_ID] = function (state) {
    return state._setaria_request_id
  };
getters[_GETTER._GET_CURRENT_ODD_NUMBER] = function (state) {
    return state._setaria_odd_number
  };
getters[_GETTER._GET_DEBUG_REQUEST_LIST] = function (state) {
    return state._setaria_debug_request_list
  };

// actions
var actions = {
};

// mutations
var mutations = {};
mutations[_MUTATION._SET_INITIAL_STATE] = function (stateObj, ref) {
    var data = ref.data;
    var error = ref.error;

    var s = stateObj;
    s._setaria_initial_state.data = data;
    s._setaria_initial_state.error = error;
  };
mutations[_MUTATION._SET_DIRECTION] = function (stateObj, val) {
    var s = stateObj;
    s._setaria_direction = val;
  };
mutations[_MUTATION._ADD_LOADING_COUNT] = function (stateObj) {
    var s = stateObj;
    s._setaria_loading += 1;
  };
mutations[_MUTATION._SUB_LOADING_COUNT] = function (stateObj) {
    var s = stateObj;
    if (s._setaria_loading > 0) {
      s._setaria_loading -= 1;
    }
  };
mutations[_MUTATION._UPDATE_DIRECTION] = function (stateObj, ref) {
    var current = ref.current;
    var next = ref.next;

    var direction = stateObj._setaria_direction;
    var routeHistory = stateObj._setaria_routeHistory;
    if (direction !== 'forward' && direction !== 'back' && direction !== 'replace') {
      if (routeHistory.history.length > 0) {
        // 当前游标处于最末尾
        if (routeHistory.currentIndex === routeHistory.history.length - 1) {
          direction = 'back';
        } else {
          var path = null;
          // 判断目标画面是否为前画面
          if (routeHistory.currentIndex !== 0) {
            path = routeHistory.history[routeHistory.currentIndex - 1].url;
            if (path === next) {
              direction = 'back';
            }
          }
          // 判断目标画面是否为次画面
          if (direction === '') {
            path = routeHistory.history[routeHistory.currentIndex + 1].url;
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
mutations[_MUTATION._UPDATE_ROUTE_HISTORY] = function (stateObj, ref) {
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
    // 替换当前路由信息
    } else if (direction === 'replace') {
      var originRouteHistory = routeHistory;
      originRouteHistory.history[routeHistory.currentIndex] = next;
      stateObj._setaria_routeHistory = {};
      stateObj._setaria_routeHistory = originRouteHistory;
    }
  };
mutations[_MUTATION._SET_FROM_PAGE_TYPE] = function (stateObj, val) {
    stateObj._setaria_from_page_type = val;
  };
mutations[_MUTATION._SET_FROM_PAGE_NAME] = function (stateObj, val) {
    stateObj._setaria_from_page_name = val;
  };
mutations[_MUTATION._ADD_TRACK] = function (stateObj, val) {
    if (val) {
      var trackBean = val;
      if (isNotEmpty(trackBean.componentLabel)) {
        trackBean.componentLabel = trim$1(trackBean.componentLabel);
      }
      trackBean.pageName = getPageName(stateObj, true);
      stateObj._setaria_track_history.push(trackBean);
    }
  };
mutations[_MUTATION._ADD_ERROR] = function (stateObj, val) {
    // 错误最多只保存100条
    if (stateObj._setaria_error_history && stateObj._setaria_error_history.length > 100) {
      stateObj._setaria_error_history.pop();
    }
    stateObj._setaria_error_history.push(val);
  };
mutations[_MUTATION._SET_PAGE_MODULE] = function (stateObj, val) {
    // 为空的场合，不进行后续处理
    if (!isNotEmpty(val)) {
      return
    }
    if (!isNotEmpty(val.uriContext) || !isNotEmpty(val.modules)) {
      return
    }
    var _setaria_page_module_list = stateObj._setaria_page_module_list;
    var index = findIndex$1(_setaria_page_module_list, function (item) { return item.uriContext === val.uriContext; });
    if (index === -1) {
      // 新增
      _setaria_page_module_list.push(val);
    } else {
      // 更新
      _setaria_page_module_list[index] = val;
    }
  };
mutations[_MUTATION._UPDATE_CURRENT_PAGE_MODULE] = function (stateObj, val) {
    var ret = [];
    var path = val;
    if (isNotEmpty(path)) {
      // Internet Explorer does not provide the leading slash character in the pathname (docs/Web/API/Location instead of /docs/Web/API/Location).
      if (!startsWith$1('/', path)) {
        path = "/" + path;
      }
      var pageModuleList = state._setaria_page_module_list;
      var index = findIndex$1(pageModuleList, function (item) { return path.indexOf(item.uriContext) !== -1; });
      if (index !== -1) {
        ret = pageModuleList[index]['modules'];
      }
    }
    stateObj._setaria_current_page_module = ret;
  };
mutations[_MUTATION._SET_REQUEST_ID] = function (stateObj, val) {
    stateObj._setaria_request_id = val;
  };
mutations[_MUTATION._SET_ODD_NUMBER] = function (stateObj, val) {
    stateObj._setaria_odd_number = val;
  };
mutations[_MUTATION._SET_DEBUG_REQUEST_LIST] = function (stateObj, val) {
    stateObj._setaria_debug_request_list.push(val);
  };
mutations[_MUTATION._CLEAR_DEBUG_REQUEST_LIST] = function (stateObj, val) {
    stateObj._setaria_debug_request_list = [];
  };

var modules = {
};

var common = {
  namespaced: true,
  state: state,
  getters: getters,
  actions: actions,
  mutations: mutations,
  modules: modules
};

var loading = {
  namespaced: true,
  state: {
    actions: {
    }
  },
  getters: {
    /**
     * 全局dispatch状态，有任一dispatch执行时，此状态为true
     */
    global: function global (state) {
      return Object.keys(state.actions).some(function (name) { return state.actions[name] === true; })
    },
    action: function action (state, key) {
      return function (key) {
        return state.actions[key]
      }
    }
  },
  mutations: {
    updateActions: function updateActions (state, ref) {
      var name = ref.name;
      var status = ref.status; if ( status === void 0 ) status = false;

      if (typeof state.actions[name] !== 'boolean') {
        state.actions[name] = false;
      }
      state.actions[name] = status;
      state.actions = merge$1({}, state.actions);
    }
  }
};

// import { getHttp } from '../../http'
function getDefaultUserInfoObject () {
  return {
    employeeName: '',
    id: '',
    type: '',
    userId: '',
    email: ''
  }
}

var state$1 = {
  userInfo: getDefaultUserInfoObject(),
  logoutUrl: '',
  todoRedirectUrl: ''
};

var getters$1 = {
  user: function (state) {
    return clone$1(state.userInfo)
  },
  isLogined: function (state) {
    return state.userInfo.userId && state.userInfo.userId !== ''
  },
  logoutUrl: function (state) { return state.logoutUrl; }
};
getters$1[_GETTER._GET_TODO_REDIRECT_URL] = function (state) { return state.todoRedirectUrl; };

var mutations$1 = {
  setUser: function setUser (stateObj, val) {
    var s = stateObj;
    var userInfo = val || getDefaultUserInfoObject();
    s.userInfo = merge$1(s.userInfo, userInfo);
  },
  setLogoutUrl: function setLogoutUrl (stateObj, val) {
    var s = stateObj;
    s.logoutUrl = val;
  }
};

var actions$1 = {
  /**
   * 取得用户信息
   *
   * @param {*} context
   * @returns
   */
  fetchUserInfo: function fetchUserInfo (context) {
    return new Promise(function (resolve) {
      resolve({
        id: 'test'
      });
    })
  }
};

var systemConfig = {
  namespaced: true,
  state: state$1,
  getters: getters$1,
  mutations: mutations$1,
  actions: actions$1
};

var storeConfig = {
  modules: ( obj = {
    loading: loading,
    systemConfig: systemConfig
  }, obj[SETARIA_SDK_STORE_MODULE] = common, obj ),
  plugins: []
};
var obj;

var initSyncState = function (globalStructure, syncConfig) {
  Object.keys(syncConfig).forEach(function (modulePath) {
    var scope = syncConfig[modulePath];
    var structure = null;
    // 根节点的场合
    if (modulePath === MODULE_ROOT) {
      structure = globalStructure;
    } else {
      structure = getModuleStructure(globalStructure, modulePath);
    }
    structure.state = syncState(structure.state, modulePath, scope);
  });
};

var syncState = function (states, modulePath, scope) {
  var ret = {};
  var storageObject = getSyncItem(scope, modulePath);
  // Storage中不存在指定数据的场合
  if (isEmpty$1(storageObject)) {
    return states
  }
  Object.keys(states).forEach(function (key) {
    ret[key] = propOr$1(states[key], key, storageObject);
  });
  return ret
};

var STORE_KEY_IN_STORAGE = '__setaria_store_sync';

// export const toObjectPath = (path) => path.replace(/\//g, '.')

var getStoreObjectByScope = function (scope) {
  var storeStorageObj = Storage.getItem(scope, STORE_KEY_IN_STORAGE);
  if (storeStorageObj === undefined || storeStorageObj === null) {
    storeStorageObj = {};
    Storage.setItem(scope, STORE_KEY_IN_STORAGE, storeStorageObj);
  }
  return storeStorageObj
};

var setSyncItem = function (scope, key, value) {
  var storeStorageObj = getStoreObjectByScope(scope);
  storeStorageObj[key] = value;
  Storage.setItem(scope, STORE_KEY_IN_STORAGE, storeStorageObj);
};

var getSyncItem = function (scope, key) {
  return getStoreObjectByScope(scope)[key]
};

var MODULE_SEPARATE_STRING = '/';
var MODULE_ROOT = '_root';

/**
 * 取得Module同步信息
 * {
 *   '_root': 'local',
 *   'module1/module1-1': 'session'
 * }
 *
 * @export
 * @param {*} structure
 * @param {*} storeScopeKey
 * @returns
 */
function createSyncConfigByStructure (structure, storeScopeKey) {
  var syncConfig = {};
  if (isNotEmpty(structure.scope)) {
    syncConfig[MODULE_ROOT] = structure.scope;
  }
  if (isNotEmpty(structure.modules)) {
    Object.keys(structure.modules).forEach(function (key) {
      path(syncConfig, storeScopeKey, structure.modules[key], key);
    });
  }
  return syncConfig
}

function path (syncConfig, storeScopeKey, structure, currentPath) {
  if (isNotEmpty(structure)) {
    if (isNotEmpty(structure.scope)) {
      syncConfig[currentPath] = structure.scope;
    }
    if (isNotEmpty(structure.modules)) {
      Object.keys(structure.modules).forEach(function (key) {
        path(syncConfig, storeScopeKey, structure.modules[key], (currentPath + "/" + key));
      });
    }
  }
}

/**
 * get module path from mutation type
 * e.g.
 * 'module1/module1-1/set_xxx' -> 'module1/module1-1'
 *
 * @export
 * @param {String} type
 * @returns
 */
function getModulePathFromType (type) {
  var ret = null;
  if (type.indexOf(MODULE_SEPARATE_STRING) !== -1) {
    ret = type.substring(0, type.lastIndexOf(MODULE_SEPARATE_STRING));
  } else {
    ret = MODULE_ROOT;
  }
  return ret
}

/**
 * get module structure
 *
 * @export
 * @param {Object} structure
 * @param {String} modulePath
 * @returns
 */
function getModuleStructure (structure, modulePath) {
  var modulePathArr = getModulePathArrByString(modulePath);
  var s = structure;
  // 根节点的场合
  if (modulePathArr.length === 0) {
    return s
  }
  var isFound = modulePathArr.every(function (path) {
    var modules = s.modules;
    if (modules === undefined || modules === null) {
      return false
    }
    if (modules[path] === undefined || modules[path] === null) {
      return false
    }
    s = modules[path];
    return true
  });
  if (isFound) {
    return s
  }
  return null
}

/**
 * 取得指定Store模块的状态
 *
 * @export
 * @param {Object} globalState
 * @param {String} modulePath
 * @returns
 */
function getModuleStateByModulePath (globalState, modulePath) {
  // 根节点的场合
  if (modulePath === MODULE_ROOT) {
    return globalState
  }
  return pathOr$1(null, modulePath.split(MODULE_SEPARATE_STRING), globalState)
}

/**
 * getModulePathArrByString
 *
 * @private
 * @param {*} val
 * @returns
 */
function getModulePathArrByString (val) {
  // 根节点的场合，返回空数组
  var modulePathArr = [];
  if (val.indexOf(MODULE_SEPARATE_STRING) !== -1) {
    // 'a/b' => ['a', 'b']
    modulePathArr = val.split(MODULE_SEPARATE_STRING);
  } else {
    // '_root' => []
    // 'module1' => ['module1']
    if (val !== MODULE_ROOT) {
      modulePathArr = [val];
    }
  }
  return modulePathArr
}

/**
 * syncConfig: {
 *   '_root': 'local',
 *   'module1/module2': 'session'
 * }
 *
 * @export
 * @param {*} syncConfig
 * @returns
 */
function createStorageSyncPlugin (syncConfig) {
  return function (store) {
    // 会在每个 mutation 完成后调用，接收 mutation 和经过 mutation 后的状态作为参数
    store.subscribe(function (ref, state) {
      var type = ref.type;

      // console.log(config.store, store, state)
      // 存在子模块的场合
      if (config.store !== null && config.store !== undefined &&
          config.store.modules !== null && config.store.modules !== undefined) {
        var modulePath = getModulePathFromType(type);
        // 存在指定子模块定义并设置了scope的场合
        var scope = syncConfig[modulePath];
        if (scope === STORAGE_TYPE.LOCAL || scope === STORAGE_TYPE.SESSION) {
          // 同步状态至Storage
          setSyncItem(scope, modulePath, getModuleStateByModulePath(state, modulePath));
        }
      }
    });
  }
}

/*  */
var createNamespacedHelpers = Vuex.createNamespacedHelpers;
var mapActions = Vuex.mapActions;
var mapGetters = Vuex.mapGetters;
var mapMutations = Vuex.mapMutations;
var mapState = Vuex.mapState;

var index = {
  createNamespacedHelpers: createNamespacedHelpers,
  mapActions: mapActions,
  mapGetters: mapGetters,
  mapMutations: mapMutations,
  mapState: mapState
};

var store;

function install$2 (Vue$$1, options) {
  // 安装Vuex
  Vue$$1.use(Vuex);
  // 取得Vuex Store配置
  var storeStructure = mergeConfig(config.store, storeConfig);
  // 添加Actions属性的访问者，在Actions的执行前和执行后进行相应处理
  addActionVisitor('', storeStructure, '');
  // 取得Module同步信息
  var syncConfig = createSyncConfigByStructure(storeStructure, config.storeScopeKey);
  // 注册插件
  initPlugin(storeStructure, syncConfig);
  // 初始化State
  initSyncState(storeStructure, syncConfig);
  // 创建Vuex Store实例
  store = new Vuex.Store(storeStructure);
}

function getStore () {
  return store
}

function initPlugin (storeStructure, syncConfig) {
  storeStructure.plugins.push(createStorageSyncPlugin(syncConfig));
}

function addActionVisitor (moduleName, moduleStructure, currentModuleNames) {
  var actions = moduleStructure.actions;
  var modules = moduleStructure.modules;
  var namespaced = moduleStructure.namespaced;
  // 添加命名空间
  if (namespaced === true) {
    if (currentModuleNames.length > 0) {
      currentModuleNames = currentModuleNames + "/" + moduleName;
    } else {
      currentModuleNames = moduleName;
    }
  }
  if (actions) {
    Object.keys(actions).forEach(function (actionName) {
      // action调用路径 (module_xxx/action)
      var actionFullName =
        "" + (currentModuleNames.length > 0 ? currentModuleNames + '/' : currentModuleNames) + actionName;
      if (typeof actions[actionName] === 'function') {
        actions[actionName] = createActionVisitor(actionFullName, actions[actionName]);
      // 命名空间的模块内注册的全局 action 的场合
      } else {
        if (actions[actionName].root === true) {
          actionFullName = actionName;
        }
        if (typeof actions[actionName].handler === 'function') {
          actions[actionName].handler = createActionVisitor(actionFullName, actions[actionName].handler);
        }
      }
    });
  }
  if (modules) {
    Object.keys(modules).forEach(function (moduleName) {
      addActionVisitor(moduleName, modules[moduleName], currentModuleNames);
    });
  }
}

function createActionVisitor (name, action) {
  return function (context, payload) {
    var result = action(context, payload);
    if (result && result.then) {
      getStore().commit('loading/updateActions', {
        name: name,
        status: true
      });
      return new Promise(function (resolve, reject) {
        result.then(function (res) {
          resolve(res);
          getStore().commit('loading/updateActions', {
            name: name,
            status: false
          });
        })
        .catch(function (err) {
          reject(err);
          getStore().commit('loading/updateActions', {
            name: name,
            status: false
          });
        });
      })
    }
  }
}

function mergeConfig (customStore, sdkStore) {
  var ret = customStore || {};
  // merge modules
  if (ret.modules === undefined || ret.modules === null) {
    ret.modules = {};
  }
  Object.keys(sdkStore.modules).forEach(function (key) {
    ret.modules[key] = sdkStore.modules[key];
  });
  // merge plugins
  if (ret.plugins === undefined || ret.plugins === null) {
    ret.plugins = [];
  }
  ret.plugins = sdkStore.plugins.concat(ret.plugins);
  return ret
}

function addLoading (config) {
  var storeInstance = getStore();
  if (storeInstance && config && config.showLoading !== false) {
    storeInstance.commit(STORE_KEY.ADD_LOADING_COUNT);
  }
  return config
}

var inBrowser = typeof window !== 'undefined';

var isFirefox = function () {
  var agent = window.navigator.userAgent.toLowerCase();
  return (typeof window !== 'undefined' && agent) &&
    /firefox\/\d+/.test(agent)
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

var ServiceError = (function (AbstractError$$1) {
  function ServiceError (
    errorCode,
    errorMessage,
    reason,
    params,
    requestId,
    oddNumber,
    showType) {
    if ( errorCode === void 0 ) errorCode = '';
    if ( errorMessage === void 0 ) errorMessage = '';
    if ( reason === void 0 ) reason = {};
    if ( params === void 0 ) params = [];
    if ( requestId === void 0 ) requestId = '';
    if ( oddNumber === void 0 ) oddNumber = '';
    if ( showType === void 0 ) showType = 2;

    var msg = errorMessage;
    // 系统自定义消息
    if (errorCode &&
        typeof errorCode === 'string' &&
        isEmpty$1(errorMessage) &&
        errorCode.indexOf('SYSMSG') === 0) {
      msg = new Message(errorCode).getMessage();
      if (isEmpty$1(msg)) {
        errorCode = '';
        msg = new Message('SYSMSG-SERVICE-UNKNOWN-ERROR').getMessage();
      }
    }
    AbstractError$$1.call(this, errorCode, msg, 'ServiceError', showType);
    this.detail = reason;
    this.requestId = requestId;
    this.oddNumber = oddNumber;
    // 在Firefox下只要不是已经明确设置不显示异常，否则抛出'unhandledrejection'事件
    if (isFirefox() && pathOr$1(true, ['config', 'isShowError'], reason) !== false) {
      dispatchUnHandlerRejectEvent(this);
    }
  }

  if ( AbstractError$$1 ) ServiceError.__proto__ = AbstractError$$1;
  ServiceError.prototype = Object.create( AbstractError$$1 && AbstractError$$1.prototype );
  ServiceError.prototype.constructor = ServiceError;

  return ServiceError;
}(AbstractError));

function subLoading (response) {
  var storeInstance = getStore();
  if (storeInstance && response.config && response.config.showLoading !== false) {
    storeInstance.commit(STORE_KEY.SUB_LOADING_COUNT);
  }
  return response
}

function throwDefaultError (messageId, messagePrefix, error) {
  var errorCode = 'SYSMSG-SERVICE-UNKNOWN-ERROR';
  if (messageId !== '') {
    errorCode = "" + messagePrefix + messageId;
  }
  throw new ServiceError(errorCode, null, error)
}
// 处理401 无权操作的信息
function process401 () {
  var windowObj = window;
  // 不是顶层窗口的场合，顶层窗口进行重定向跳转至登陆页面
  if (window.top !== window) {
    windowObj = window.top;
  }
  if (windowObj) {
    // 跳转至登陆页面
    windowObj.location.href = (windowObj.location.protocol) + "//" + (windowObj.location.host) + "/index.html";
  }
}

// error handler
function errorHandler (error) {
  // sub loading state count
  subLoading({
    config: error.config
  });
  // server have response
  if (error.response) {
    console.error('server have response', error, error.response);
    var messagePrefix = 'SYSMSG-SERVICE-STATUS-';
    var messageId = '';
    switch (error.response.status) {
      case 400:
        messageId = '400';
        break
      case 401:
        messageId = '401';
        process401();
        return
      case 403:
        messageId = '403';
        break
      case 404:
        messageId = '404';
        break
      case 405:
        messageId = '405';
        break
      case 502:
        messageId = '502';
        break
      case 504:
        messageId = '504';
        break
      default:
        messageId = '';
    }
    if (error.response.data) {
      var responseData = error.response.data;
      // 调用服务时若指定responseType为arraybuffer, 则axios返回的response.data类型为arraybuffer
      if (error.config.responseType === 'arraybuffer') {
        try {
          responseData = JSON.parse(Buffer.from(responseData).toString('utf8'));
        } catch (e) {
          throwDefaultError(messageId, messagePrefix, error);
        }
      }
      var code = responseData.code;
      var message = responseData.message;
      var requestId = responseData.requestId;
      var oddNumber = responseData.oddNumber;
      if (isNotEmpty(code)) {
        throw new ServiceError(code, message, error, requestId, oddNumber)
      }
    }
    throwDefaultError(messageId, messagePrefix, error);
  // The request was made but no response was received
  } else if (error.request) {
    console.error('The request was made but no response was received', error);
  // Something happened in setting up the request that triggered an Error
  } else {
    console.error('Something happened in setting up the request that triggered an Error', error);
    // timeout
    if (error.message.indexOf('timeout of ') === 0) {
      throw new ServiceError('SYSMSG-SERVICE-TIMEOUT', null, error, [error.config.timeout / 1000])
    // server unavaliable
    } else if (error.message.indexOf('Network Error') === 0) {
      throw new ServiceError('SYSMSG-SERVICE-NETWORK-ERROR', null, error)
    } else {
      throw new ServiceError('SYSMSG-SERVICE-UNKNOWN-ERROR', null, error)
    }
  }
  return Promise.reject(error)
}

var defaultInterceptor = {
  homepage: {
    request: [
      [
        addLoading
      ]
    ],
    response: [
      [
        subLoading, errorHandler
      ]
    ]
  }
};

function getLogControlType (componentLabel, pageName, prevPageName, prevPageComponentLabel, querys, eventName, tracingList) {
  if ( prevPageName === void 0 ) prevPageName = '';
  if ( prevPageComponentLabel === void 0 ) prevPageComponentLabel = '';
  if ( tracingList === void 0 ) tracingList = [];

  var currentPageName = '';
  if (isNotEmpty(pageName)) {
    var pageNameList = pageName.split(',');
    currentPageName = pageNameList[pageNameList.length - 1];
  }
  // 4.查询
  if (componentLabel === '查询') {
    return LOG_TYPE.SEARCH
  }
  // 7.转单
  if (componentLabel === '转发') {
    return LOG_TYPE.TRANSFER
  }
  // 审批查看页且在此页面上点击了审批或提交按钮
  if ((currentPageName.indexOf('审批') !== -1 || currentPageName.indexOf('查看') !== -1) &&
    (componentLabel === '审批' || componentLabel === '提交')) {
    // 没有前页面的场合
    if (prevPageName === '' ||
    // 前页面为工作台，且点击的按钮为审批按钮的场合
      (prevPageName && prevPageName.indexOf('工作台') !== -1 && prevPageComponentLabel === '审批')) {
      // 2.审批
      return LOG_TYPE.APPROVAL
    }
    // TODO 填单判断逻辑
    var isBpmSubmitStep = false;
    if (isBpmSubmitStep) {
      // 1.填单
      return LOG_TYPE.CREATE
    }
    // TODO 修改判断逻辑
    var isBpmReSubmitStep = false;
    if (isBpmReSubmitStep) {
      // 5.修改
      return LOG_TYPE.UPDATE
    }
    if (prevPageName.indexOf('创建') !== -1) {
      // 1.填单
      return LOG_TYPE.CREATE
    }
    if (prevPageName.indexOf('修改') !== -1) {
      // 5.修改
      return LOG_TYPE.UPDATE
    }
  } else if ((currentPageName.indexOf('审批') !== -1 || currentPageName.indexOf('查看') !== -1) &&
    (eventName === 'init' ||
    prevPageComponentLabel === '查看')) {
    return LOG_TYPE.VIEW
  }
  return ''
}

function appendCustomHeader (config$$1) {
  if (config$$1 && (config$$1.headers === undefined || config$$1.headers === null)) {
    config$$1.headers = {};
  }
  var headers = config$$1.headers;
  var storeInstance = getStore();
  if (storeInstance) {
    // 用户信息
    var user = storeInstance.getters['systemConfig/user'];
    if (user) {
      headers['loginUserId'] = user.userId;
      headers['loginAddrCode'] = user.addrCode;
    }
    // 开发环境时，增加token信息
    {
      var devToken = storeInstance.getters['systemConfig/devToken'];
      devToken ? headers['AUTHSSOTGC'] = devToken : '';
    }
    // 开发环境
    // 业务公共辅助信息
    var oddNumber = storeInstance.getters[STORE_KEY.GET_CURRENT_ODD_NUMBER];
    if (isNotEmpty(oddNumber)) {
      headers['oddNumber'] = window.encodeURIComponent(oddNumber);
    }
    // 埋点
    var tracingBean = storeInstance.getters[STORE_KEY.GET_LASTEST_TRACK];
    if (tracingBean) {
      var componentLabel = tracingBean.componentLabel;
      var pageName = tracingBean.pageName;
      var querys = tracingBean.querys;
      var eventName = tracingBean.eventName;
      if (config.log === true) {
        var ref = storeInstance.getters[STORE_KEY.GET_PREV_PAGE_TRACK](pageName) || {};
        var prevPageName = ref.pageName;
        var prevPageComponentLabel = ref.componentLabel;
        var tracingList = storeInstance.getters[STORE_KEY.GET_TRACK_LIST];
        var logControlType = getLogControlType(componentLabel, pageName, prevPageName, prevPageComponentLabel, querys, eventName, tracingList);
        console.log('日志操作类型', logControlType);
        // 日志操作类型
        if (isNotEmpty(logControlType)) {
          headers['logOperationType'] = logControlType;
        }
      }
      var eventPage = storeInstance.getters[STORE_KEY.GET_CURRENT_PAGE_MODULE] || [];
      eventPage = eventPage.map(function (item) { return item.label; }).concat(pageName).join(',');
      // 埋点事件触发时所在页面名称
      // 格式：一级模块,二级模块,三级页面  例：采购管理,框架合同,框架合同工作台
      if (isNotEmpty(pageName)) {
        headers['eventPage'] = window.encodeURIComponent(eventPage);
      }
      // 组件显示名称
      if (isNotEmpty(componentLabel)) {
        headers['eventComponent'] = window.encodeURIComponent(componentLabel);
      }
      // 组件触发的事件
      if (isNotEmpty(eventName)) {
        headers['eventType'] = eventName;
      }
    }
  }
  return config$$1
}

/**
 * 取得调用服务时指定的ResponseType
 */
function getResponseType (response) {
  var request = (response && response.request) || {};
  return request.responseType
}

/**
 * 判断是否执行文件下载逻辑
 */
function isExecuteFileDownload (response) {
  var responseType = getResponseType(response);
  return responseType === 'arraybuffer' ||
    responseType === 'blob'
}

function fileDownload (response) {
  if (isExecuteFileDownload(response)) {
    var mime = response.headers['content-type'];
    // 修复某些场合下response header key为大写字母时，无法取得文件信息的问题
    var disposition = response.headers['content-disposition'] || response.headers['CONTENT-DISPOSITION'];
    var filename = 'unknown-file';
    if (disposition) {
      filename = decodeURI(disposition.match(/filename="(.*)"/)[1]);
    }
    var blob = new window.Blob([response.data], { type: mime || 'application/octet-stream' });
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      // IE workaround for "HTML7007: One or more blob URLs were
      // revoked by closing the blob for which they were created.
      // These URLs will no longer resolve as the data backing
      // the URL has been freed."
      window.navigator.msSaveBlob(blob, filename);
    } else {
      var blobURL = window.URL.createObjectURL(blob);
      var tempLink = document.createElement('a');
      tempLink.style.display = 'none';
      tempLink.href = blobURL;
      tempLink.setAttribute('download', filename);

      // Safari thinks _blank anchor are pop ups. We only want to set _blank
      // target if the browser does not support the HTML5 download attribute.
      // This allows you to download files in desktop safari if pop up blocking
      // is enabled.
      if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank');
      }

      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobURL);
    }
  }
  return response
}

function businessErrorHandler (response) {
  // ContentType为application/json的场合
  if (response && response.headers &&
    response.headers['content-type'].indexOf('application/json') !== -1) {
    var ref = response.data;
    var code = ref.code;
    var message = ref.message;
    var requestId = ref.requestId;
    var oddNumber = ref.oddNumber;
    // when got business exception
    if (code !== API_RESPOSNE_CODE_TYPES.SUCCESS) {
      throw new ServiceError(code, message, null, requestId, oddNumber)
    }
  }
  return response
}

function commonHandler (response) {
  var ref = response.data;
  var requestId = ref.requestId;
  var oddNumber = ref.oddNumber;
  if (isNotEmpty(oddNumber)) {
    getStore().commit(STORE_KEY.SET_ODD_NUMBER, oddNumber);
  }
  if (isNotEmpty(requestId)) {
    getStore().commit(STORE_KEY.SET_REQUEST_ID, requestId);
  }
  //debug模式
  if(response.config.headers.clientDebugMode){
    getStore().commit(STORE_KEY.SET_DEBUG_REQUEST_LIST, {
      responseData:response.data,
      url:response.config.url,
      requestData:response.config.data,
      method:response.config.method
    });
  }
  return response
}

var defaultHttpConfig = {
};

/*  */
/**
 * 远程服务调用模块
 * @version 1.0
 * @author HanL
 */
var KEY_DEFAULTS_SETTING = 'defaults';
var KEY_CACHE_CONTROL = 'Cache-Control';
var KEY_PRAGMA = 'Pragma';

var http = {};

function install$1 (Vue$$1, options) {
  // 默认http实例
  http = {};

  // Http Config
  var httpConfig = merge$1(defaultHttpConfig, config.http) || {};
  if (config.http) {
    // 合并默认defaultHttp设置
    Object.keys(defaultHttpConfig).forEach(function (defaultHttpConfigKey) {
      if (config.http[defaultHttpConfigKey] === undefined || config.http[defaultHttpConfigKey] === null) {
        config.http[defaultHttpConfigKey] = defaultHttpConfig[defaultHttpConfigKey];
      }
    });
    // 初始化http实例
    Object.keys(config.http).forEach(function (key) {
      if (!http.hasOwnProperty(key)) {
        Object.defineProperty(http, key, {
          enumerable: true,
          writable: true
        });
      }
    });
  }
  // 设定Axios默认设置
  initAxiosDefaultConfig(httpConfig.defaults);
  http[KEY_DEFAULTS_SETTING] = axios;
  // Set Custom Http Instance
  if (Object.keys(httpConfig).length > 0) {
    var instance = initInstance(httpConfig);
    Object.keys(instance).forEach(function (key) {
      if (key === KEY_DEFAULTS_SETTING) {
        http[key] = axios;
      } else {
        http[key] = instance[key];
      }
      // Set Http Interceptor
      initInterceptor(key, http[key]);
    });
  }
}

function getHttp () {
  return http
}

/**
 * Set Http Default Config
 *
 * @param {*} httpConfig
 */
function initAxiosDefaultConfig (httpConfigDefault) {
  if ( httpConfigDefault === void 0 ) httpConfigDefault = {};

  // Set default http config
  if (httpConfigDefault !== undefined && httpConfigDefault !== null) {
    Object.keys(httpConfigDefault).forEach(function (key) {
      axios.defaults[key] = httpConfigDefault[key];
    });
  }
  if (httpConfigDefault.headers === undefined || httpConfigDefault.headers === null) {
    httpConfigDefault.headers = {};
  }
  // 定义默认Headers设置，当没有设置缓存策略时，设置ajax请求默认不使用缓存
  var headers = axios.defaults.headers;
  var isCacheControlDefine =
    findIndex$1(Object.keys(headers), function (key) { return key.toLowerCase() === KEY_CACHE_CONTROL.toLowerCase(); });
  // 没有定义Cache-Control的场合，默认不缓存ajax请求
  if (isCacheControlDefine === -1) {
    headers[KEY_CACHE_CONTROL] = 'no-cache';
  }
  var isPragmaDefine =
    findIndex$1(Object.keys(headers), function (key) { return key.toLowerCase() === KEY_PRAGMA.toLowerCase(); });
  // 没有定义Pragma的场合，默认不缓存ajax请求
  if (isPragmaDefine === -1) {
    headers[KEY_PRAGMA] = 'no-cache';
  }
}

/**
 * Set Custom Http Instance
 *
 * @param {*} httpConfig
 * @returns
 */
function initInstance (httpConfig) {
  var isNeedCreateCustomHttpInstance = Object.keys(httpConfig).some(function (key) {
    if (key !== KEY_DEFAULTS_SETTING) {
      return true
    }
    return false
  });
  if (isNeedCreateCustomHttpInstance) {
    var ret = {};
    Object.keys(httpConfig).forEach(function (key) {
      if (key !== KEY_DEFAULTS_SETTING) {
        var config$$1 = httpConfig[key];
        // set module showLoading varible by user default setting
        var showLoading = false;
        var defaultConfig = httpConfig[KEY_DEFAULTS_SETTING];
        if (defaultConfig &&
          typeof defaultConfig.showLoading === 'boolean') {
          showLoading = defaultConfig.showLoading;
        }
        config$$1.showLoading = showLoading;
        // create module baseURL
        config$$1.baseURL = createModuleDefaultBaseURL(defaultConfig.baseURL, key, config$$1.baseURL);
        config$$1.responseEncoding = 'UTF8';
        config$$1.timeout = 0; // nginx已经设置了请求的超时时间
        ret[key] = {};
        ret[key] = axios.create(config$$1);
        // add non-exist function to axios instance
        ret[key].all = axios.all;
        ret[key].spread = axios.spread;
      }
    });
    return ret
  } else {
    return {}
  }
}

/**
 * 生成模块API的baseURL
 *
 * @export
 * @param {string} baseURL
 * @param {string} moduleKey
 * @param {string} moduleBaseUrl
 * @returns
 */
function createModuleDefaultBaseURL (baseURL, moduleKey, moduleBaseUrl) {
  var ret = moduleBaseUrl;
  var modulePath = kebabCase(moduleKey);
  // 模块api没有定义baseURL的场合
  if (!isEmpty$1(baseURL) && isEmpty$1(ret)) {
    // 使用key自动生成baseURL
    ret = baseURL + "/api-" + modulePath + "/api/" + modulePath + "/";
  }
  return ret
}

/**
 * Set Http Interceptor
 *
 * @param {*} http
 */
function initInterceptor (key, http) {
  var requestInterceptors = [
    [
      addLoading
    ],
    [
      appendCustomHeader
    ]
  ];
  var responseInterceptors = [
    [
      commonHandler
    ],
    [
      subLoading, errorHandler
    ],
    [
      businessErrorHandler
    ],
    [
      fileDownload
    ]
  ];
  // 自定义拦截器
  var httpInterceptorConfig = defaultInterceptor[key];
  // 定义了自定义请求处理拦截器的场合
  if (httpInterceptorConfig && httpInterceptorConfig.request) {
    requestInterceptors = httpInterceptorConfig.request;
  }
  // 定义了自定义返回处理拦截器的场合
  if (httpInterceptorConfig && httpInterceptorConfig.response) {
    responseInterceptors = httpInterceptorConfig.response;
  }
  // add interceptor to instance
  if (typeof http === 'function') {
    requestInterceptors.forEach(function (interceptor) {
      var r = http.interceptors.request;
      r.use.apply(r, interceptor);
    });
    // Tips: response interceptor will not be executed when got error
    responseInterceptors.forEach(function (interceptor) {
      var r = http.interceptors.response;
      r.use.apply(r, interceptor);
    });
  } else {
    Object.keys(http).forEach(function (key) {
      requestInterceptors.forEach(function (interceptor) {
        var r = http[key].interceptors.request;
        r.use.apply(r, interceptor);
      });
      responseInterceptors.forEach(function (interceptor) {
        var r = http[key].interceptors.response;
        r.use.apply(r, interceptor);
      });
    });
  }
}

// import Vue from 'vue'
function install$4 (Setaria, Vue$$1, options) {
  if (isEmpty$1(options)) {
    return
  }
  var entry = options.entry;
  var error = options.error;
  var loading = options.loading;
  // 实例化Vue根组件
  if (isNotEmpty(entry)) {
    // 进行异步处理，getInitialState函数必须返回Promise
    if (typeof entry.getInitialState === 'function') {
      Setaria.refreshInitialState = Vue$$1.prototype.$setaria.api.refreshInitialState = function () {
        return getInitialState(entry, getHttp(), getRouter(), getStore())
      };
      Vue$$1.component(
        'async-app',
        // 这个动态导入会返回一个 `Promise` 对象。
        function () { return (
          {
            // 需要加载的组件 (应该是一个 `Promise` 对象)
            component: getInitialState(entry, getHttp(), getRouter(), getStore()),
            // 异步组件加载时使用的组件
            loading: loading,
            // 加载失败时使用的组件
            error: error,
            // 展示加载时组件的延时时间。默认值是 200 (毫秒)
            delay: 200,
            // 如果提供了超时时间且组件加载也超时了，
            // 则使用加载失败时使用的组件。默认值是：`Infinity`
            timeout: 3000
          }
        ); }
      );
      entry.sdk = {};
      new Vue$$1({
        el: entry.el,
        sdk: {},
        render: function (h) {
          return h('async-app')
        }
      });
      // option "el" can only be used during instance creation with the `new` keyword.
      if (entry.el) {
        delete entry.el;
      }
    }
  }
}

function getInitialState (entry, http, router, store) {
  return new Promise(function (resolve, reject) {
    entry.getInitialState({
      http: http,
      router: router,
      store: store
    }).then(function (res) {
      store.commit(STORE_KEY.SET_INITIAL_STATE, {
        data: res
      });
      resolve(entry);
    }).catch(function (error) {
      store.commit(STORE_KEY.SET_INITIAL_STATE, {
        error: error
      });
      reject(error);
    });
  })
}

var _Vue;

function install$$1 (Setaria, Vue$$1, options) {
  return function (Vue$$1, options) {
    if (install$$1.installed && _Vue === Vue$$1) { return }
    install$$1.installed = true;
    _Vue = Vue$$1;
    var isDef = function (v) { return v !== undefined; };

    if (!isDef(Vue$$1.prototype.$setaria)) {
      Vue$$1.prototype.$setaria = {
        api: {}
      };
    }

    Vue$$1.mixin({
      beforeCreate: function beforeCreate () {
        if (isDef(this.$options.sdk)) {
          this._sdk = this.$options.sdk;
          // set store instance on vue
          this.$options.store = Setaria.getStore();
          // set router instance on vue
          this.$options.router = Setaria.getRouter();
        } else {
          this._sdk = (this.$parent && this.$parent._sdk) || this;
        }
      },
      destroyed: function destroyed () {
        // console.error('destroyed', this.$options.sdk)
      }
    });

    // init http
    install$1(Vue$$1, options);
    // init store
    install$2(Vue$$1, options);
    // init router
    install$3(Vue$$1, options);
    // init vue app
    install$4(Setaria, Vue$$1, options);

    Vue$$1.mixin({
      beforeRouteEnter: function beforeRouteEnter (to, from, next) {
        var loadStartTime = new Date().getTime();
        next(function (vm) {
          if (vm && vm.$options) {
            var currentComponentName = vm.$options.name || '';
            var excludeComponentArray = config.excludeRecordPageLoadTimeComponentName || [];
            if (findIndex$1(excludeComponentArray, function (item) { return item === currentComponentName; }) === -1) {
              var currentTime = new Date().getTime();
              var pageName = vm.$store.getters[STORE_KEY.GET_PAGE_FULL_NAME](',');
              if (typeof config.logHandler === 'function') {
                try {
                  config.logHandler(pageName, LOG_TYPE.PAGE_LOAD, currentTime - loadStartTime, vm);
                } catch (e) {
                  // do nothing
                }
              }
              console.log((pageName + " 页面加载耗时 " + (currentTime - loadStartTime) + "ms"));
            }
          }
        });
      }
    });

    // set http instance on vue
    if (Vue$$1.prototype.$api === null || Vue$$1.prototype.$api === undefined) {
      Object.defineProperty(Vue$$1.prototype, '$api', {
        get: function get () { return Setaria.getHttp() }
      });
    }

    // add alias for http usage
    Setaria.api = Setaria.getHttp();

    // 系统信息处理
    // 保存工程子模块url与模块属性的映射关系
    var moduleUrlRules = config.moduleUrlRules;
    if (isNotEmpty(moduleUrlRules)) {
      Object.keys(moduleUrlRules).forEach(function (rule) {
        Setaria.getStore().commit(STORE_KEY.SET_PAGE_MODULE, {
          uriContext: rule,
          modules: moduleUrlRules[rule]
        });
      });
    }
  }
}

/*  */
/**
 * 判断是否为ApplicationError
 * @param {*} error
 */
function isApplicationError (error) {
  return typeof error === 'object' && error._name &&
    error._name === 'ApplicationError'
}

/**
 * 判断是否为ServiceError
 * @param {*} error
 */
function isServiceError (error) {
  return typeof error === 'object' && error._name &&
    error._name === 'ServiceError'
}

function parseApplicationError (error) {
  var ret = null;
  // TODO 需要确认此处error为什么为undefined
  if (error === undefined || error === null) {
    ret = new ApplicationError('MAM004E');
  } else if (isApplicationError(error)) {
    ret = new ApplicationError(error.errorCode, [], error.errorMessage, error.showType);
  } else if (isServiceError(error)) {
    ret = error;
    // 普通Error对象
  } else if (error.message) {
    var code = '';
    var message = '';
    // eslint-disable-next-line no-undef-init
    var showType = undefined;
    message = error.message;
    // 删除浏览器添加的错误信息前缀
    // firefox
    if (message.indexOf('Error: ') === 0) {
      message = message.replace('Error: ', '');
    // chrome, safari
    } else if (message.indexOf('Uncaught Error: ') === 0) {
      message = message.replace('Uncaught Error: ', '');
    // chrome
    } else if (message.indexOf('Uncaught TypeError: ' === 0)) {
      message = message.replace('Uncaught TypeError: ', '');
    }
    // 解析SDK错误信息，取得错误代码和错误内容
    if (message.indexOf(ERROR_PREFIX) !== -1) {
      if (message.indexOf(ERROR_MSG_SPLICER) !== -1) {
        var msgArr = message.split(ERROR_MSG_SPLICER);
        code = msgArr[0].replace(ERROR_PREFIX, '').replace('[', '').replace(']', '');
        showType = msgArr[1];
        if (isNotEmpty(showType)) {
          showType = showType.replace('{', '').replace('}', '');
        }
        message = msgArr[2];
      } else {
        code = 'unknown';
      }
    }
    ret = new ApplicationError(code, [], message, showType);
  } else if (typeof error.toString === 'function') {
    ret = new ApplicationError(null, null, error.toString());
  } else {
    ret = new ApplicationError('MAM004E');
  }
  return ret
}

function isIgnoreError (errorObject) {
  var errorString = '';
  if (typeof errorObject === 'string') {
    errorString = errorObject;
  } else if (typeof errorObject === 'object' && errorObject.name) {
    errorString = errorObject.name;
  }
  var ignoreErrorTypeArray = ['SCRIPT438'];
  var index = findIndex$1(ignoreErrorTypeArray, function (ignoreErrorType) { return errorString.indexOf(ignoreErrorType) === 0; });
  return index !== -1
}

var ErrorHandler = function ErrorHandler () {};

ErrorHandler.init = function init () {
  // Vue异常
  // 从 2.2.0 起，这个钩子也会捕获组件生命周期钩子里的错误。同样的，当这个钩子是 undefined 时，被捕获的错误会通过 console.error 输出而避免应用崩溃。
  // 从 2.4.0 起，这个钩子也会捕获 Vue 自定义事件处理函数内部的错误了。
  // 从 2.6.0 起，这个钩子也会捕获 v-on DOM 监听器内部抛出的错误。另外，如果任何被覆盖的钩子或处理函数返回一个 Promise 链 (例如 async 函数)，
  // 则来自其 Promise 链的错误也会被处理。
  Vue.config.errorHandler = function (err, vm, info) {
    console.error('The Exception from Vue', vm, info);
    ErrorHandler.handleError(ERROR_THROW_TYPES.VUE_ERROR, err, {
      vm: vm,
      info: info
    });
  };
  // JavaScript执行期异常
  window.onerror = function (err) {
    console.error('The Exception from window.onerror');
    ErrorHandler.handleError(ERROR_THROW_TYPES.NORMAL_ERROR, err, {});
  };

  // promise异常
  // 目前最新版的Firefox浏览器不支持PromiseRejectionEvent
  // Promise Rejection异常处理函数
  var unhandledrejectionHandler = function (err) {
    console.error('The Exception from promise');
    ErrorHandler.handleError(ERROR_THROW_TYPES.PROMISE_UNREJECT_ERROR, err, {});
  };
  // 绑定Promise Reject Event处理逻辑
  window.onunhandledrejection = unhandledrejectionHandler;
};

/**
 * 处理捕获的异常
 */
ErrorHandler.handleError = function handleError (
  type,
  error,
  source) {
  var requestId = null;
  var oddNumber = null;
  if (type === ERROR_THROW_TYPES.PROMISE_UNREJECT_ERROR) {
    requestId = error.reason.requestId;
    oddNumber = error.reason.oddNumber;
  }
  // 取得异常内容
  var errorObject = this.parseError(type, error, source);
  // 生产环境不显示部分错误类型
  var isIgnoreErrorFlag = "development" === 'production' && isIgnoreError(error);
  var storeInstance = getStore();
  storeInstance.commit(STORE_KEY.ADD_ERROR, {
    error: errorObject,
    origin: error,
    type: type,
    requestId: requestId,
    oddNumber: oddNumber
  });
  if (typeof config.errorHanlder === 'function' && !isIgnoreErrorFlag) {
    config.errorHanlder(errorObject, type, error, source);
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
  if (type === ERROR_THROW_TYPES.VUE_ERROR) {
    ret = parseApplicationError(error);
  } else if (type === ERROR_THROW_TYPES.NORMAL_ERROR) {
    if (typeof error === 'string') {
      error = {
        message: error
      };
    }
    ret = parseApplicationError(error);
  // Promise回调函数中抛出的异常
  } else if (type === ERROR_THROW_TYPES.PROMISE_UNREJECT_ERROR) {
    ret = parseApplicationError(error.reason);
  } else {
    ret = new ApplicationError('MAM004E');
  }

  // 实现了Vue.config.errorHandler接口的场合，Vue不会在控制台显示错误。
  if (type === ERROR_THROW_TYPES.VUE_ERROR) {
    /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
    console.error(error);
  }
  return ret
};

function initGlobalAPI (SDK, instance) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  {
    configDef.set = function () {
      console.warn(
        'Do not replace the SDK.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(SDK, 'config', configDef);

  SDK.getHttp = getHttp;
  SDK.createModuleDefaultBaseURL = createModuleDefaultBaseURL;
  SDK.getRouter = getRouter;
  SDK.getStore = getStore;
}

// M[Message Catagory]XXX[Message Type]
// Message Catagory:
//   AM Application Message
// Message Type:
//   E Error
//   I Info
//   W Warning
var sdkMessage = {
  'SYSMSG-CLIENT-UNKNOWN-ERROR': '客户端出现错误，请重试或联系管理员。',
  'SYSMSG-NOT-SUPPORT-STORAGE': '当前浏览器设置不允许访问本地存储空间。',
  'SYSMSG-VALIDATION-REQUIRED': '{0}不能为空。',
  'SYSMSG-SERVICE-STATUS-400': '无效的请求。',
  'SYSMSG-SERVICE-STATUS-401': '当前请求需要用户验证。',
  'SYSMSG-SERVICE-STATUS-403': '远程服务拒绝执行。',
  'SYSMSG-SERVICE-STATUS-404': '后台服务不存在。',
  'SYSMSG-SERVICE-STATUS-405': '方法不支持。',
  'SYSMSG-SERVICE-STATUS-502': '后台服务网关错误（Bad Gateway）。',
  'SYSMSG-SERVICE-STATUS-504': '服务执行超时。',
  'SYSMSG-SERVICE-UNKNOWN-ERROR': '服务器内部错误，请联系管理员。',
  'SYSMSG-SERVICE-NETWORK-ERROR': '远程服务器无法连接，请联系管理员或稍后重试。',
  'SYSMSG-SERVICE-TIMEOUT': '服务未在预定时间（{0}秒）内返回结果，请联系管理员或稍后重试。',
  'SYSMSG-ROUTE-NOT-EXIST': '无法找到指定页面。'
};

var defaultVueConfig = {
  publicPath: ("/" + (process.env.VUE_APP_SITE_ID) + (process.env.VUE_APP_CLIENT_BASE_URL)),
  lintOnSave: true,
  productionSourceMap: false,
  pages: {
    index: process.env.VUE_APP_ENTRY_PAGE_FILE
  },
  configureWebpack: {
    devtool: 'eval-source-map',
    entry: {
      framework: ['setaria'],
      vendors: ['vue', 'vuex', 'vue-router', 'moment', 'lodash', 'numeral']
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          framework: {
            chunks: 'async',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            name: 'framework'
          },
          vendors: {
            chunks: 'async',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            name: 'vendors'
          }
        }
      }
    }
  }
};

function withDefaultVueConfig (customizeConfig) {
  return mergeDeepRight$1(defaultVueConfig, customizeConfig)
}

var defaultConfig = {
  withDefaultVueConfig: withDefaultVueConfig
};

var inBrowser$1 = typeof window !== 'undefined';
var UA = inBrowser$1 && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0);
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA));
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

/**
 * 取得当前站点协议、域名和端口号
 */
var getLocationOrigin = function () {
  if (window.location.origin) {
    return window.location.origin
  }
  if (isIE) {
    var ref = window.location;
    var host = ref.host;
    var protocol = ref.protocol;
    var ref$1 = window.location;
    var port = ref$1.port;
    if (port !== '') {
      port = ":" + port;
    }
    return (protocol + "//" + host + port)
  }
  return ''
};



var index$1 = Object.freeze({
	inBrowser: inBrowser$1,
	UA: UA,
	isIE: isIE,
	isIE9: isIE9,
	isEdge: isEdge,
	isAndroid: isAndroid,
	isIOS: isIOS,
	isChrome: isChrome,
	isPhantomJS: isPhantomJS,
	isFF: isFF,
	getLocationOrigin: getLocationOrigin,
	merge: merge$1,
	mergeDeepRight: mergeDeepRight$1,
	pathOr: pathOr$1,
	propOr: propOr$1,
	findIndex: findIndex$1,
	keys: keys,
	isNotEmpty: isNotEmpty,
	isEmpty: isEmpty$1,
	isArray: isArray,
	clone: clone$1,
	trim: trim$1,
	startsWith: startsWith$1,
	endsWith: endsWith$1,
	camelCase: camelCase,
	kebabCase: kebabCase
});

var Setaria = function Setaria (options) {
  if ( options === void 0 ) options = {};

  var _sdk = this;
  this.initConfig(options);
  initGlobalAPI(Setaria, _sdk);
  ErrorHandler.init();
  // 不由框架进行Vue根组件的创建
  if (isEmpty$1(options.entry)) {
    return
  }
  Vue.use(Setaria, options);
};

/**
 * 初始化设置，增加新设置项的场合，需要在此处进行merge
 */
Setaria.prototype.initConfig = function initConfig (ref) {
    var message = ref.message; if ( message === void 0 ) message = {};
    var http = ref.http; if ( http === void 0 ) http = {};
    var routes = ref.routes; if ( routes === void 0 ) routes = {};
    var store = ref.store; if ( store === void 0 ) store = {};
    var storeScopeKey = ref.storeScopeKey;
    var logHandler = ref.logHandler;
    var excludeRecordPageLoadTimeComponentName = ref.excludeRecordPageLoadTimeComponentName;
    var log = ref.log;
    var moduleUrlRules = ref.moduleUrlRules;

  config.message = merge$1(sdkMessage, message);
  config.http = http || {};
  config.routes = routes || {};
  config.store = store || {};
  // Vuex Store Scope Key
  if (isNotEmpty(storeScopeKey)) {
    config.storeScopeKey = storeScopeKey;
  }
  if (isNotEmpty(excludeRecordPageLoadTimeComponentName)) {
    config.excludeRecordPageLoadTimeComponentName = excludeRecordPageLoadTimeComponentName;
  }
  if (typeof logHandler === 'function') {
    config.logHandler = logHandler;
  }
  if (typeof log === 'boolean') {
    config.log = log;
  }
  if (isNotEmpty(moduleUrlRules)) {
    config.moduleUrlRules = moduleUrlRules;
  }
  console.log('config init complete');
};

Setaria.install = install$$1(Setaria);
Setaria.version = '0.4.2';

if (inBrowser && window.Vue) {
  window.Vue.use(Setaria);
}

exports['default'] = Setaria;
exports.ApplicationError = ApplicationError;
exports.constants = constants;
exports.defaultConfig = defaultConfig;
exports.Message = Message;
exports.ServiceError = ServiceError;
exports.StoreGlobalAPI = index;
exports.util = index$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
