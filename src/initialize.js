import 'styles/index';
import store from 'src/store.js';
import { setHash } from 'src/util/url-hash';

import Toolbar from 'components/Toolbar';
import LoadingBar from 'components/LoadingBar';
import EventMap from 'components/EventMap';
import EventList from 'components/EventList';

// Load events data
store.dispatch('loadEvents')

// And then keep grabbing events data once per minute
setInterval(() => {store.dispatch('loadEvents')}, 60000);

// Load valid zipcodes
store.dispatch('loadZips')

// Initialize Vue instances with the store.
Toolbar(store);
LoadingBar(store);
EventMap(store);
EventList(store);

// Allow HMR updates
if (module.hot) {
  module.hot.accept();
}
