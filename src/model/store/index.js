import common from './module/common'

const debug = process.env.NODE_ENV !== 'production'
const structure = {
  modules: {
    common
  },
  strict: debug
}

let store

export function create (Store) {
  store = new Store(structure)
  return store
}

function get () {
  return store
}

export default get
