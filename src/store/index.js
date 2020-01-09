import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    score: 0,
  },
  mutations: {
    ADD_SCORE: (state, val) => state.score += val,
    RESET_SCORE: (state) => state.score = 0,
  },
  plugins: [createPersistedState()],
})
