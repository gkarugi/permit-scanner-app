import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import scanner from './modules/scanner'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    scanner
  },

  state: {},

  mutations: {}, 

  actions: {}
});
