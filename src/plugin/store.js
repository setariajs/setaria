/* @flow */
import Vue from 'vue'
import Vuex from 'vuex'
import { create } from '../model/store/index'

Vue.use(Vuex)
const store: Object = create(Vuex.Store)
export default store
