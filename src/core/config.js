/* @flow */

export type Config = {
  errorHandler: Function,
  http: Object,
  message: Object,
  routes: Object,
  store: Object,
  storeScopeKey: string,
  excludeRecordPageLoadTimeComponentName: Array<string>,
  logHandler: Function,
  log: boolean,
  moduleUrlRules: Object,
  entry: Object,
  getInitialState: Function,
  loading: Object,
  error: Object
}

export default ({
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
  moduleUrlRules: null,

  /**
   * 初始化VUE实例设置(el, render等)
   */
  entry: null,
  /**
   * 自定义初始化逻辑
   */
  getInitialState: null,
  /**
   * 执行初始化逻辑时的loading组件
   */
  loading: null,

  /**
   * 执行初始化逻辑出错的场合，显示的error组件
   */
  error: null
}: Config)
