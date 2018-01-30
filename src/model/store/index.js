/* @flow */
import common from './common'
import types from './types'

const SETARIA_STORE = '_setaria_.common'

const debug: boolean = process.env.NODE_ENV !== 'production'
const structure: Object = {
  modules: {
    [SETARIA_STORE]: common
  },
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

export { SETARIA_STORE, types }

export type SetariaStore = Function
