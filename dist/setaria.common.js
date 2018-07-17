/**
 * Setaria v0.3.3
 * (c) 2018 Ray Han
 * @license MIT
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var axios = _interopDefault(require('axios'));
var Vuex = _interopDefault(require('vuex'));
var R = require('ramda');
var VueRouter = _interopDefault(require('vue-router'));
var Vue = _interopDefault(require('vue'));

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
   */
  storeScopeKey: 'scope'
});

// Module
// Common
var SETARIA_STORE_MODULE = '_setaria_common_';

// Getter
var _GETTER = {
  '_GET_IS_LOADING': '_setaria_get_is_loading',
  '_GET_LOADING_COUNT': '_setaria_get_loading_count',
  '_GET_ROUTE_HISTORY': '_setaria_get_route_history',
  '_GET_ROUTE_CURRENT_INDEX': '_setaria_get_route_current_index',
  '_GET_DIRECTION': '_setaria_get_direction'
};
// Mutation
var _MUTATION = {
  '_SET_DIRECTION': '_setaria_set_direction',
  '_ADD_LOADING_COUNT': '_setaria_add_loading_count',
  '_SUB_LOADING_COUNT': '_setaria_sub_loading_count',
  '_UPDATE_DIRECTION': '_setaria_update_direction',
  '_UPDATE_ROUTE_HISTORY': '_setaria_update_route_history'
};

var STORE_KEY = {
  // Common
  SETARIA_STORE_MODULE: SETARIA_STORE_MODULE,
  GET_IS_LOADING: (SETARIA_STORE_MODULE + "/" + (_GETTER._GET_IS_LOADING)),
  GET_LOADING_COUNT: (SETARIA_STORE_MODULE + "/" + (_GETTER._GET_LOADING_COUNT)),
  GET_ROUTE_HISTORY: (SETARIA_STORE_MODULE + "/" + (_GETTER._GET_ROUTE_HISTORY)),
  GET_ROUTE_CURRENT_INDEX: (SETARIA_STORE_MODULE + "/" + (_GETTER._GET_ROUTE_CURRENT_INDEX)),
  GET_DIRECTION: (SETARIA_STORE_MODULE + "/" + (_GETTER._GET_DIRECTION)),
  SET_DIRECTION: (SETARIA_STORE_MODULE + "/" + (_MUTATION._SET_DIRECTION)),
  ADD_LOADING_COUNT: (SETARIA_STORE_MODULE + "/" + (_MUTATION._ADD_LOADING_COUNT)),
  SUB_LOADING_COUNT: (SETARIA_STORE_MODULE + "/" + (_MUTATION._SUB_LOADING_COUNT)),
  UPDATE_DIRECTION: (SETARIA_STORE_MODULE + "/" + (_MUTATION._UPDATE_DIRECTION)),
  UPDATE_ROUTE_HISTORY: (SETARIA_STORE_MODULE + "/" + (_MUTATION._UPDATE_ROUTE_HISTORY))
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

var ERROR_TYPES = {
  // 非Vue组件的常规错误
  'NORMAL_ERROR': 0,
  // Promise回调函数中的错误
  'PROMISE_UNREJECT_ERROR': 1,
  // 从 Vue 2.2.0 起，Vue组件生命周期钩子里的错误可以被捕获。
  // 从 Vue 2.4.0 起，Vue组件自定义事件句柄内部的错误可以被捕获。
  'VUE_ERROR': 2
};

var constants = {
  ERROR_TYPES: ERROR_TYPES,
  MESSAGE_TYPE: MESSAGE_TYPE,
  STORE_KEY: STORE_KEY,
  STORAGE_TYPE: STORAGE_TYPE
};

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
getters[_GETTER._GET_ROUTE_HISTORY] = function (state) { return state._setaria_routeHistory; };
getters[_GETTER._GET_ROUTE_CURRENT_INDEX] = function (state) { return state._setaria_routeHistory.currentIndex; };
getters[_GETTER._GET_IS_LOADING] = function (state) { return state._setaria_loading !== 0; };
getters[_GETTER._GET_LOADING_COUNT] = function (state) { return state._setaria_loading; };
getters[_GETTER._GET_DIRECTION] = function (state) { return state._setaria_direction; };

// actions
var actions = {
};

// mutations
var mutations = {};
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
    }
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

var storeConfig = {
  modules: ( obj = {}, obj[SETARIA_STORE_MODULE] = common, obj ),
  plugins: []
};
var obj;

function merge$1 (obj1, obj2) {
  return R.merge(obj1, obj2)
}

function pathOr$1 (defaultValue, path, obj) {
  return R.pathOr(defaultValue, path, obj)
}

function propOr$1 (defaultValue, key, obj) {
  return R.propOr(defaultValue, key, obj)
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
var ERROR_PREFIX = 'Setaria Error';
var ERROR_MSG_SPLICER = ':';

var ApplicationError = (function (Error) {
  function ApplicationError (id, params, message) {
    if ( id === void 0 ) id = '';
    if ( params === void 0 ) params = [];
    if ( message === void 0 ) message = '';

    var msg = message;
    if (isEmpty$1(id)) {
      id = 'unknown';
    }
    if (isEmpty$1(message)) {
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
var STORAGE_KEY = '__Setaria_Storage_';



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
  console.debug('storeSyncConfig', syncConfig);
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
var store;

function install$2 (Vue$$1, options) {
  // 安装Vuex
  Vue$$1.use(Vuex);
  // 取得Vuex Store配置
  var storeStructure = mergeConfig(config.store, storeConfig);
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

function mergeConfig (customStore, setariaStore) {
  var ret = customStore || {};
  // merge modules
  if (ret.modules === undefined || ret.modules === null) {
    ret.modules = {};
  }
  Object.keys(setariaStore.modules).forEach(function (key) {
    ret.modules[key] = setariaStore.modules[key];
  });
  // merge plugins
  if (ret.plugins === undefined || ret.plugins === null) {
    ret.plugins = [];
  }
  ret.plugins = setariaStore.plugins.concat(ret.plugins);
  return ret
}

function addLoading (config) {
  var storeInstance = getStore();
  if (storeInstance && config.showLoading !== false) {
    storeInstance.commit(STORE_KEY.ADD_LOADING_COUNT);
  }
  return config
}

function subLoading (response) {
  var storeInstance = getStore();
  if (storeInstance && response.config.showLoading !== false) {
    storeInstance.commit(STORE_KEY.SUB_LOADING_COUNT);
  }
  return response
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
    if (isFirefox() && pathOr$1(true, ['config', 'isShowError'], reason) !== false) {
      dispatchUnHandlerRejectEvent(this);
    }
  }

  if ( ApplicationError$$1 ) ServiceError.__proto__ = ApplicationError$$1;
  ServiceError.prototype = Object.create( ApplicationError$$1 && ApplicationError$$1.prototype );
  ServiceError.prototype.constructor = ServiceError;

  return ServiceError;
}(ApplicationError));

// error handler
function errorHandler (error) {
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

/*  */
/**
 * 远程服务调用模块
 * @version 1.0
 * @author HanL
 */
var http;

function install$1 (Vue$$1, options) {
  http = {
    defaults: axios
  };

  // Http Config
  var httpConfig = config.http || {};

  // Set Http Default Config
  initConfig(httpConfig);

  // Set Custom Http Instance
  if (Object.keys(httpConfig).length > 0) {
    var instance = initInstance(httpConfig);
    Object.keys(instance).forEach(function (key) {
      http[key] = instance[key];
    });
  }

  // Set Http Interceptor
  initInterceptor(http);
}

function getHttp () {
  return http
}

var KEY_DEFAULTS_SETTING = 'defaults';

/**
 * Set Http Default Config
 *
 * @param {*} httpConfig
 */
function initConfig (httpConfig) {
  // Set default http config
  var httpConfigDefault = httpConfig[KEY_DEFAULTS_SETTING];
  if (httpConfigDefault !== undefined && httpConfigDefault !== null) {
    Object.keys(httpConfigDefault).forEach(function (key) {
      axios.defaults[key] = httpConfigDefault[key];
    });
  }
}

/**
 * Set Custom Http Instance
 *
 * @param {*} httpConfig
 * @returns
 */
function initInstance (httpConfig) {
  var isCreateCustomHttpInstance = Object.keys(httpConfig).some(function (key) {
    if (key !== KEY_DEFAULTS_SETTING) {
      return true
    }
    return false
  });
  if (isCreateCustomHttpInstance) {
    var ret = {};
    Object.keys(httpConfig).forEach(function (key) {
      var config$$1 = httpConfig[key];
      config$$1.showLoading = true;
      ret[key] = axios.create(config$$1);
      // add non-exist function to axios instance
      ret[key].all = axios.all;
      ret[key].spread = axios.spread;
    });
    return ret
  } else {
    return {}
  }
}

/**
 * Set Http Interceptor
 *
 * @param {*} http
 */
function initInterceptor (http) {
  var requestInterceptors = [
    [addLoading]
  ];
  var responseInterceptors = [
    [
      subLoading, errorHandler
    ]
  ];
  // Tips: response interceptor will not be executed when got error
  // add interceptor to instance
  if (typeof http === 'function') {
    requestInterceptors.forEach(function (interceptor) {
      var r = http.interceptors.request;
      r.use.apply(r, interceptor);
    });
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

/*  */
var router;

function install$3 (Vue$$1, options) {
  // 安装VueRouter
  Vue$$1.use(VueRouter);
  // 创建Vue Router实例
  router = new VueRouter(config.routes);
}

function getRouter () {
  return router
}

var _Vue;

function install$$1 (Setaria, Vue$$1, options) {
  return function (Vue$$1, options) {
    if (install$$1.installed && _Vue === Vue$$1) { return }
    install$$1.installed = true;
    _Vue = Vue$$1;

    var isDef = function (v) { return v !== undefined; };

    Vue$$1.mixin({
      beforeCreate: function beforeCreate () {
        // console.debug('beforeCreate', this.$options.setaria)
        if (isDef(this.$options.setaria)) {
          this._setaria = this.$options.setaria;
          // set store instance on vue
          this.$options.store = Setaria.getStore();
          // set router instance on vue
          this.$options.router = Setaria.getRouter();
        } else {
          this._setaria = (this.$parent && this.$parent._setaria) || this;
        }
      },
      destroyed: function destroyed () {
        // console.debug('destroyed', this.$options.setaria)
      }
    });

    if (Vue$$1.prototype.$http === null || Vue$$1.prototype.$http === undefined) {
      Object.defineProperty(Vue$$1.prototype, '$http', {
        get: function get () { return Setaria.getHttp() }
      });
    }

    // Object.defineProperty(Vue.prototype, '$s', {
    //   get () { return this._setaria }
    // })

    // init http
    install$1(Vue$$1, options);
    // init store
    install$2(Vue$$1, options);
    // init router
    install$3(Vue$$1, options);
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

var ErrorHandler = function ErrorHandler () {};

ErrorHandler.init = function init () {
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
  if (typeof config.errorHanlder === 'function') {
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

function initGlobalAPI (Setaria, instance) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = function () {
      console.warn(
        'Do not replace the Setaria.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Setaria, 'config', configDef);

  Setaria.getHttp = getHttp;
  Setaria.getRouter = getRouter;
  Setaria.getStore = getStore;

  instance.http = getHttp();
  instance.router = getRouter();
  instance.store = getStore();
}

// M[Message Catagory]XXX[Message Type]
// Message Catagory:
//   AM Application Message
// Message Type:
//   E Error
//   I Info
//   W Warning
var setariaMessage = {
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

var Setaria = function Setaria (options) {
  if ( options === void 0 ) options = {};

  var _setaria = this;
  this.initConfig(options);
  initGlobalAPI(Setaria, _setaria);
  ErrorHandler.init();
};

Setaria.prototype.initConfig = function initConfig (ref) {
    var message = ref.message; if ( message === void 0 ) message = {};
    var http = ref.http; if ( http === void 0 ) http = {};
    var routes = ref.routes; if ( routes === void 0 ) routes = {};
    var store = ref.store; if ( store === void 0 ) store = {};
    var storeScopeKey = ref.storeScopeKey;

  config.message = merge$1(setariaMessage, message);
  config.http = http || {};
  config.routes = routes || {};
  config.store = store || {};
  // Vuex Store Scope Key
  if (isNotEmpty(storeScopeKey)) {
    config.storeScopeKey = storeScopeKey;
  }
};

Setaria.install = install$$1(Setaria);
Setaria.version = '0.3.3';

if (inBrowser && window.Vue) {
  window.Vue.use(Setaria);
}

exports['default'] = Setaria;
exports.ApplicationError = ApplicationError;
exports.constants = constants;
exports.Message = Message;
exports.ServiceError = ServiceError;
