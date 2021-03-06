import Vue from 'vue';
import Vuex from 'vuex';
import xhr from 'xhr';
import { computeFilteredEvents } from 'src/util/events';
import querystring from 'querystring';

//Save the initial hash of the window when Vue initializes.
//We'll use these values to populate the initial store filter values
const initialHash = querystring.parse(window.location.hash.replace(/^#/, '') ||
                                      window.location.search.replace(/^\?/, ''))

//A small Vuex plugin that will update the browsers location querystring whenever
//the setFilters mutation occurs
const hashUpdaterPlugin = (store) => {
  store.subscribe((mutation, state) => {
    if(mutation.type === "filtersReceived"){
      const newQs = '?' + querystring.stringify(state.filters)
      if (newQs !== window.location.search) {
        window.history.pushState(
          null, null, '?'+querystring.stringify(state.filters))
        window.dispatchEvent(new Event('pushstate'))
      }
    }
  })
}

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    events: [],
    zipcodes: {},
    us_states: {},
    view: 'list',
    filters: initialHash,
    map: null,
    selectedEventIds: [],
    hoveredEventIds: [],
    // We initialize eventTypes just with our "virtual" event type,
    // and the rest are loaded from the server
    eventTypes: {
      aclu: "Official ACLU Event"
    }
  },
  actions: {
    loadEvents({commit}){
      xhr({
        method: 'GET',
        url: '//d3r5pbxngwkvri.cloudfront.net/action_events_v2.json',
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
    loadUSStates({commit}){
      xhr({
        method: 'GET',
        url: '/us_states.json',
        json: true,
      }, (err, response) => {
        if (err) return;
        commit('us_statesReceived', response.body);
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
    },
    setMap({ commit }, { map }) {
      process.nextTick(() => {
        commit('mapChanged', map);
      });
    }
  },
  mutations: {
    eventsReceived(state, events) {
      state.events = events.events;

      const newEventTypes = Object.entries(events.categories).reduce((result, [category, { label, disabled }]) => {
        if (!disabled) {
          result[category] = label;
        }
        return result;
      }, {});

      state.eventTypes = {
        ...state.eventTypes,
        ...newEventTypes,
      };
    },
    zipcodesReceived(state, zipcodes) {
      state.zipcodes = zipcodes;
    },
    us_statesReceived(state, us_states) {
      state.us_states = us_states;
    },
    viewToggled(state) {
      state.view = state.view === 'map' ? 'list' : 'map';
    },
    filtersReceived(state, filters) {
      state.filters = {...state.filters, ...filters};
    },
    mapChanged(state, map) {
      state.map = map;
      state.hoveredEventIds = [];
    },
    eventSelected(state, eventIds) {
      state.selectedEventIds = eventIds;
    },
    eventHovered(state, eventIds) {
      state.hoveredEventIds = eventIds;
    }
  },
  getters: {
    filteredEvents: state => {
      return computeFilteredEvents(state.events, state.map,
                                   state.filters, state.zipcodes)
    }
  },
  plugins: [hashUpdaterPlugin]
});

export default store;
