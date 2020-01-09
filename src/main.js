import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Vuex from 'vuex'
Vue.use(Vuex)

import VueLuckywheel from 'vue-luckywheel'
import 'vue-luckywheel/lib/vue-luckywheel.css'
Vue.use(VueLuckywheel)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
