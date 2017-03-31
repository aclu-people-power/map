import 'styles/index';
import 'core-js/es6/promise';
import xhr from 'xhr';
import store from 'src/store.js';
import { setHash } from 'src/util/url-hash';

import Header from 'components/Header';
import LoadingBar from 'components/LoadingBar';
import EventMap from 'components/EventMap';
import EventList from 'components/EventList';

function loadEvents() {
  xhr({
    method: 'GET',
    url: 'http://d3r5pbxngwkvri.cloudfront.net/action_events.json',
    json: true,
  }, (err, response) => {
    if (err) return;
    store.commit('eventsReceived', response.body);
  });
}

// Load events data
loadEvents();

// And then keep grabbing events data once per minute 
setInterval(loadEvents, 6000);

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
Header(store);
LoadingBar(store);
EventMap(store);
EventList(store);

if (module.hot) {
  module.hot.accept();
}
