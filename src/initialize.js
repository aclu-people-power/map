import 'styles/index';
import 'core-js/es6/promise';
import xhr from 'xhr';
import store from 'src/store.js';
import { loadEvents, pollForNewEvents } from 'src/util/events';
import { setHash } from 'src/util/url-hash';

import Toolbar from 'components/Toolbar';
import LoadingBar from 'components/LoadingBar';
import EventMap from 'components/EventMap';
import EventList from 'components/EventList';

// Load events data
loadEvents((err) => {
  if (err) return;
  store.commit('eventsReceived', window.PEOPLEPOWER_EVENTS);
});

// And then keep grabbing events data once per minute 
pollForNewEvents(60000, (err) => {
  if (err) return;
  store.commit('eventsReceived', window.PEOPLEPOWER_EVENTS);
});

// Load valid zipcodes
xhr({
  method: 'GET',
  url: '/us_postal_codes.json',
  json: true,
}, (err, response) => {
  if (err) return;
  store.commit('zipcodesReceived', response.body);
});

// Initialize Vue instances with the store.
Toolbar(store);
LoadingBar(store);
EventMap(store);
EventList(store);

if (module.hot) {
  module.hot.accept();
}
