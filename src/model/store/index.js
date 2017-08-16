/* @flow */
import common from './module/common'

const debug: boolean = process.env.NODE_ENV !== 'production'
const structure: Object = {
  modules: {
    common
  },
  strict: debug
}

let store: Object

export function create (Store: Function) {
  store = new Store(structure)
  return store
}

function get (): ?Object {
  return store
}

export default get
