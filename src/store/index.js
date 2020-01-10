import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

// import storage from 'vue-offline-worker';
// const { offline, mixinOff } = storage.register('testapp', '1.0.0', 'store');

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

// export default {
//   store: new Vuex.Store({
//     state: {
//       score: 0,
//     },
    
//     mutations: Object.assign({
//       ADD_SCORE: (state, val) => state.score += val,
//       RESET_SCORE: (state) => state.score = 0,
//     }, offline.mutations),

//     plugins: [createPersistedState(), offline.plugin],
//   }),
//   // export mixi too
//   mixinOff
// }