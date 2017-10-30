/* @flow */
import common from './module/common'

const debug: boolean = process.env.NODE_ENV !== 'production'
const structure: Object = {
  modules: {
    common
  },
  strict: debug
}

let storeInstance: Object

export function createStore (Store: Function): Object {
  storeInstance = new Store(structure)
  return storeInstance
}

export function getStore (): ?Object {
  return storeInstance
}

export type SetariaStore = Function
