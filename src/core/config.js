/* @flow */

export type Config = {
  errorHandler: Function,
  http: Object,
  message: Object,
  routes: Object,
  store: Object,
  storeScopeKey: string,
  vpnKey: string,
  excludeRecordPageLoadTimeComponentName: Array<string>,
  logHandler: Function,
  log: boolean,
  moduleUrlRules: Object
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
}: Config)
