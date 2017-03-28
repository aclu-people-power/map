import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    events: [{title: 'event1'}, {title: 'event2'}, {title: 'event3'}],
    zipcodes: [],
    loading: true,
    count: 1
  },
  mutations: {
    increment (state) {
      state.count++
    },
    decrement (state) {
      state.count--
    },
    loaded (state) {
      state.loading = false
    }
  }
})
