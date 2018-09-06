/* @flow */

export type Config = {
  errorHandler: Function,
  http: Object,
  message: Object,
  routes: Object,
  store: Object,
  storeScopeKey: String
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
  storeScopeKey: 'scope'
}: Config)
