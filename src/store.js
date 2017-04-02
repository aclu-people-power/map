import Vue from 'vue';
import Vuex from 'vuex';
import xhr from 'xhr';
import { computeFilteredEvents } from 'src/util/events';
import querystring from 'querystring';

//Save the initial hash of the window when Vue initializes.
//We'll use these values to populate the initial store filter values
let initialHash = querystring.parse(window.location.hash.replace(/^#/, ''))

//A small Vuex plugin that will update the browsers location hash whenever
//the setFilters mutation occurs
const hashUpdaterPlugin = (store) => {
  store.subscribe((mutation, state) => {
    if(mutation.type === "setFilters"){
      window.location.hash = querystring.stringify(state.filters)
    }
  })
}

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    events: [],
    zipcodes: [],
    view: 'map',
    filters: initialHash
  },
  actions: {
    loadEvents({commit}){
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
    viewToggled(state) {
      state.view = state.view === 'map' ? 'list' : 'map';
    },
    setFilters(state, filters) {
      state.filters = {...state.filters, ...filters}
    },
  },
  getters: {
    filteredEvents: state => {
      return computeFilteredEvents(state.events, state.filters, state.zipcodes)
    }
  },
  plugins: [hashUpdaterPlugin]
});

// When url filters change, update the store.
// onHashChange((filters) => store.commit('filtersReceived', filters));
window.store = store;
export default store;
