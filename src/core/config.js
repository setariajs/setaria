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
   */
  storeScopeKey: 'scope'
}: Config)
