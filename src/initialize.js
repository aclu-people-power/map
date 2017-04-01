import 'styles/index';
import store from 'src/store.js';
import { setHash } from 'src/util/url-hash';

import Header from 'components/Header';
import LoadingBar from 'components/LoadingBar';
import EventMap from 'components/EventMap';
import EventList from 'components/EventList';

// Load events data
store.dispatch('loadEvents')
const ONE_MINUTE = 60000;

// And then keep grabbing events data once per minute
// the rate at which the data feed is regenerated.
setInterval(() => {store.dispatch('loadEvents')}, ONE_MINUTE);

// Load valid zipcodes
store.dispatch('loadZips')

// Initialize Vue instances with the store.
Header(store);
LoadingBar(store);
EventMap(store);
EventList(store);

// Allow HMR updates
if (module.hot) {
  module.hot.accept();
}
