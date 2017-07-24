import 'styles/index';
import 'babel-polyfill';
import 'modernizr';

import store from 'src/store.js';
import querystring from 'querystring';

import Header from 'components/Header';
import Footer from 'components/Footer';
import EventMap from 'components/EventMap';
import EventList from 'components/EventList';

let params = querystring.parse(window.location.hash.replace('#', ''));

// set up cobranding based on url params
let cobrand = {};
if (params.c === 'vr') {
  cobrand = {
    logoFile: 'logo-second-chances.png',
    hostEventLink: 'https://go.peoplepower.org/signup/host_vr?source=map',
    showACLU: false
  };
}
console.log('initialize params', params);

// Load events data
store.dispatch('loadEvents')
const ONE_MINUTE = 60000;

// And then keep grabbing events data once per minute
// the rate at which the data feed is regenerated.
setInterval(() => {store.dispatch('loadEvents')}, ONE_MINUTE);

// Load valid zipcodes
store.dispatch('loadZips')

// Set initial event filters based on campaign
if (params.c === 'vr') {
  store.state.filters['eventType'] = 'votingRights';
}

// Initialize Vue instances with the store.
Header(store, cobrand);
EventMap(store);
EventList(store);
Footer(cobrand);

// Allow HMR updates
if (module.hot) {
  module.hot.accept();
}
