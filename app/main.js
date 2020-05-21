import VueDevtools from 'nativescript-vue-devtools'
import Vue from 'nativescript-vue'
import Login from './components/Login'

if (TNS_ENV !== 'production') {
  Vue.use(VueDevtools, { host: '192.168.0.122' })
  // Vue.use(VueDevtools)
}

import store from './store/store'

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.registerElement(
  'PullToRefresh',
  () => require('@nstudio/nativescript-pulltorefresh').PullToRefresh
);

new Vue({
  store,
  render: h => h('frame', [h(Login)]),
  created() {
    // this.$store.dispatch("init")
  },
}).$start()
