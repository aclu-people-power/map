import moment from 'moment';
import { getFilteredEvents } from './util/event-utils';
import { plotEvents, setMapPositionBasedOnZip } from './util/map-utils';
import { getHash, setHash, onHashChange } from './util/url-hash';

// FIXME DEBUG this is just here to poke around with and set event
// filters via the JS console.
window.setHash = setHash;

// Boot:

// This will move into the map component
function plotAndZoom(filters) {

  // first we compute the filtered event set
  const filteredEvents = getFilteredEvents(window.PEOPLEPOWER_EVENTS, filters);

  // then plot those events
  plotEvents(filteredEvents, window.map);

  // then adjust map position accordingly
  setMapPositionBasedOnZip(
    filters.zipcode,
    window.KNOWN_ZIPCODES,
    filteredEvents,
    window.map
  );
}

// Once initially on boot, based on initial filters in URL
plotAndZoom(getHash());

// Also when the event filters change
onHashChange(plotAndZoom);

// TODO translate back and forth with date range into two fields

// Start up Vue
import Vue from 'vue';

//Just a quick dummy app to make sure vue is working
let app = new Vue({
  el: '#clock',
  template: '<p id="clock">The current time is: {{time}}</p>',
  data: {
    time: moment().format('hh:mm:ss a')
  },
  style: {
    fontSize: '20px'
  }
})

function tick(){
  setTimeout(function(){
    app.$data.time = moment().format('hh:mm:ss a');
    tick();
  },1000);
};tick();
