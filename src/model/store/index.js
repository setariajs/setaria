/* @flow */
import config from './config'
import common from './common'
import plugins from './plugins'
import types from './types'
import { initState } from './util'
import { SCOPE } from '../Storage'

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

function registerModule (name: String, moduleObject: Object, scope: SCOPE): void {
  const module = moduleObject
  if (scope) {
    module.state = initState(module.state, name, scope)
    config.sync[name] = scope
  }
  storeInstance.registerModule(name, moduleObject)
}

export {
  registerModule,
  types
}

export type SetariaStore = Function
