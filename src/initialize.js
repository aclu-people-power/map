import 'styles/index';
import 'babel-polyfill';
import 'modernizr';

import store from 'src/store.js';
import querystring from 'querystring';

import Header from 'components/Header';
import Footer from 'components/Footer';
import EventMap from 'components/EventMap';
import EventList from 'components/EventList';

let params = querystring.parse(window.location.search.replace('?', ''));
console.log(params);
let showACLU = true;
if (params.b === 'co') {
  showACLU = false;
}

// Load events data
store.dispatch('loadEvents')
const ONE_MINUTE = 60000;

// And then keep grabbing events data once per minute
// the rate at which the data feed is regenerated.
setInterval(() => {store.dispatch('loadEvents')}, ONE_MINUTE);

// Load valid zipcodes
store.dispatch('loadZips')

// Load valid US states
store.dispatch('loadUSStates')

// Initialize Vue instances with the store.
Header(store, {showACLU: showACLU});
EventMap(store);
EventList(store);
Footer({showACLU: showACLU});

// Allow HMR updates
if (module.hot) {
  module.hot.accept();
}
