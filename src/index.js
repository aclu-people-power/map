import moment from 'moment';
import { getFilteredEvents } from './util/event-utils';
import { plotEvents, setMapPositionBasedOnZip } from './util/map-utils';


// Boot:

// (the url will be the source of truth for these values. here
//  we are just faking it)
const filters = {
  eventType: null,
  dateRange: null,
  zipcode: null,
};

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
