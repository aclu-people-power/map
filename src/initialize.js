import 'styles/index';
import 'babel-polyfill';
import 'modernizr';

import store from 'src/store.js';
import querystring from 'querystring';

import Header from 'components/Header';
import Footer from 'components/Footer';
import EventMap from 'components/EventMap';
import EventList from 'components/EventList';

import acluLogoFile from 'assets/images/logo-aclu.png';
import vrLogoFile from 'assets/images/logo-second-chances.png';

let params = querystring.parse(window.location.hash.replace('#', ''));
// set up branding based on url params
let branding = {
  logoFile: acluLogoFile,
  hostEventLink: 'https://go.peoplepower.org/signup/host_new?source=map',
  showACLU: true
};
let campaign = params.c || params.campaign || '';
if ((campaign.toLowerCase() === 'vr') || (campaign.toLowerCase() === 'votingrights')) {
  branding = {
    logoFile: vrLogoFile,
    hostEventLink: 'https://go.peoplepower.org/event/voting_rights/create/?source=map',
    showACLU: false
  };
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

// Set initial event filters based on campaign
if (params.c === 'vr') {
  store.state.filters['us_state'] = 'FL';
  store.state.filters['eventType'] = 'votingRights';
}

// Initialize Vue instances with the store.
Header(store, branding);
EventMap(store);
EventList(store);
Footer(branding);

// Allow HMR updates
if (module.hot) {
  module.hot.accept();
}
