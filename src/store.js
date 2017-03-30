import Vue from 'vue';
import Vuex from 'vuex';
import xhr from 'xhr';
import { getHash, onHashChange } from 'src/util/url-hash';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    events: [],
    zipcodes: [],
    filters: getHash(),
    view: 'map'
  },
  actions: {
    loadEvents({commit}){
      console.log('loading events');
      xhr({
        method: 'GET',
        url: 'http://d3r5pbxngwkvri.cloudfront.net/action_events.json',
        json: true,
      }, (err, response) => {
        if (err) return;
        commit('eventsReceived', response.body);
      });
    },
    loadZips({commit}){
      console.log('loading zips');
      xhr({
        method: 'GET',
        url: '/us_postal_codes.json',
        json: true,
      }, (err, response) => {
        if (err) return;
        commit('zipcodesReceived', response.body);
      });
    }
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
