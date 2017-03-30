import Vue from 'vue';
import Vuex from 'vuex';
import { getHash, onHashChange } from 'src/util/url-hash';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    events: [],
    zipcodes: [],
    filters: getHash(),
    view: 'map'
  },
  mutations: {
    eventsReceived(state, events) {
      state.events = events;
    },
    zipcodesReceived(state, zipcodes) {
      state.zipcodes = zipcodes;
    },
    filtersReceived(state, filters) {
      state.filters = filters;
    },
    viewToggled(state) {
      state.view = state.view === 'map' ? 'list' : 'map';
    }
  }
});

// When url filters change, update the store.
onHashChange((filters) => store.commit('filtersReceived', filters));

export default store;
