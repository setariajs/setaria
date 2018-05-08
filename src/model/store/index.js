/* @flow */
import common from './common'
import plugins from './plugins'
import types from './types'

const debug: boolean = process.env.NODE_ENV !== 'production'
const structure: Object = {
  modules: {
    [common.name]: common
  },
  plugins,
  strict: debug
}

let storeInstance: Object

export function createStore (Store: Function): Object {
  // singleton
  if (storeInstance === null || storeInstance === undefined) {
    storeInstance = new Store(structure)
  }
  return storeInstance
}

export function getStore (): ?Object {
  return storeInstance
}

export function registerModule (name: String, moduleObject: Object): void {
  storeInstance.registerModule(name, moduleObject)
}

export { types }

export type SetariaStore = Function
