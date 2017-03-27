import moment from 'moment';
import { getFilteredEvents } from './util/event-utils';
import { plotEvents, setMapPositionBasedOnZip } from './util/map-utils';
import { getHash, setHash, onHashChange } from './util/url-hash';
import { pollForNewEvents } from './util/events-poll';



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

// Once we are rolling with a vue app probably this will be
// a little different
if (module.hot) {
  module.hot.accept();
}
