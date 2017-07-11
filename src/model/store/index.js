import common from './module/common';
import * as actions from './action';
import * as getters from './getter';

const debug = process.env.NODE_ENV !== 'production';
const structure = {
  actions,
  getters,
  modules: {
    common,
  },
  strict: debug,
};

let store;

export function create(Store) {
  store = new Store(structure);
  return store;
}

function get() {
  return store;
}

export default get;
