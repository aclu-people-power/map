import 'styles/index';
import 'core-js/es6/promise';
import xhr from 'xhr';
import store from 'src/store.js';
import { setHash } from 'src/util/url-hash';

import Header from 'components/Header';
import LoadingBar from 'components/LoadingBar';
import EventMap from 'components/EventMap';
import EventList from 'components/EventList';
import Modernizr from 'modernizr';

if(Modernizr.webgl && Modernizr.flexbox){
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

  const ONE_MINUTE = 60000;

  // And then keep grabbing events data once per minute,
  // the rate at which the data feed is regenerated.
  setInterval(loadEvents, ONE_MINUTE);

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
}
