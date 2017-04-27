import Vue from 'vue';
import Vuex from 'vuex';
import xhr from 'xhr';
import { computeFilteredEvents } from 'src/util/events';
import querystring from 'querystring';

//Save the initial hash of the window when Vue initializes.
//We'll use these values to populate the initial store filter values
const initialHash = querystring.parse(window.location.hash.replace(/^#/, ''))

//A small Vuex plugin that will update the browsers location hash whenever
//the setFilters mutation occurs
const hashUpdaterPlugin = (store) => {
  store.subscribe((mutation, state) => {
    if(mutation.type === "filtersReceived"){
      window.location.hash = querystring.stringify(state.filters)
    }
  })
}

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    events: [],
    zipcodes: {},
    view: 'list',
    filters: initialHash,
    selectedEventId: null
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
    },
    setFilters({ commit }, filters) {
      // Pushing this to the next tick because it triggers a large
      // workload which can momentarily block the UI interaction that
      // initiated it and feel laggy. The reason this is split into
      // an action and a mutation is to facilitate this nextTick-ing.
      process.nextTick(() => {
        commit('filtersReceived', filters);
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
    filtersReceived(state, filters) {
      state.filters = {...state.filters, ...filters};
    },
    eventSelected(state, eventId) {
      state.selectedEventId = eventId;
    }
  },
  getters: {
    filteredEvents: state => {
      return computeFilteredEvents(state.events, state.filters, state.zipcodes)
    }
  },
  plugins: [hashUpdaterPlugin]
});

export default store;
