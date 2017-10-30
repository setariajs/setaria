/* @flow */
import Vue from 'vue'
import Vuex from 'vuex'
import { createStore } from '../model/store/index'

Vue.use(Vuex)
const store: Object = createStore(Vuex.Store)
export default store
