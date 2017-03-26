import moment from 'moment';
import { getFilteredEvents } from './util/event-utils';
import { plotEvents, setMapPositionBasedOnZip } from './util/map-utils';
import { getHash, setHash, onHashChange } from './util/url-hash';

// temporary thing so that changing zipcode via UI updates query
document.getElementById('zipcode').addEventListener('input', (event) => {
  const value = event.target.value;
  if (/^\d+$/.test(value) && value.length === 5) {
    setHash({ zipcode: value });
  }
});

// temporary thing for setting event type and start/end dates via JS
// console, e.g. setHash({ eventType: 'hi', startDate: '2017-03-21'})
window.setHash = setHash;

// Boot:


// FIXME this stuff will move into the map component
let eventsLayer = null;

function plotAndZoom(filters) {

  // wipe out existing plotted events -- probably this can
  // be done more efficiently
  if (eventsLayer) {
    eventsLayer.clearLayers();
  }

  // compute filtered event set
  const filteredEvents = getFilteredEvents(window.PEOPLEPOWER_EVENTS, filters);

  // then plot those events
  eventsLayer = plotEvents(filteredEvents, window.map);

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
