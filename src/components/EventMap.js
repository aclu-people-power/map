import Vue from 'vue';
import { pollForNewEvents, loadEvents } from 'src/util/events-poll';

export default function(store){
  return new Vue({
    el: '#event-map',
    name: 'event-map',
    template: require('html-loader!src/templates/EventMap.html'),
    store,
    methods: {
      loaded() {
        store.commit('loaded');
      },
      loadMapbox() {
        console.log('Loading Mapbox');
        self = this;

        //Proof of concept (load and initialize mapbox.js after rest of vue has initialize)
        //Note, in reality we may actually want to start download of mapbox.js earlier in the process... tbd
        require.ensure(['mapbox.js'], function(){
          let mapbox = require('mapbox.js');
          console.log('required mapbox.js');

          L.mapbox.accessToken = "pk.eyJ1Ijoia2VubmV0aHBlbm5pbmd0b24iLCJhIjoiY2l6bmJ3MmFiMDMzZTMzbDJtdGxkM3hveSJ9.w4iOGaL2vrIvETimSXUXsw";

          const centerOfUS = [37.8, -96.9];
          const zoom = 4;

          window.map = L.mapbox.map('map', 'mapbox.streets')
            .setView(centerOfUS, zoom);

          //FIXME:: Figure out when/where/how we actually want to mark the map as being loaded
          setTimeout(() => {
            self.loaded();
          },4000)
        });
      }
    },
    mounted: function() {
      this.loadMapbox();
    },
  })
}

// // FIXME: actually initialize a map on mount. Below code from initialize-map.js and old index.js file
// // This makes window.L (leaflet.js) available. mapbox.js
// // is a leaflet plugin.
// import 'styles/index';
// import 'mapbox.js';
//
// L.mapbox.accessToken = "pk.eyJ1Ijoia2VubmV0aHBlbm5pbmd0b24iLCJhIjoiY2l6bmJ3MmFiMDMzZTMzbDJtdGxkM3hveSJ9.w4iOGaL2vrIvETimSXUXsw";
//
// const centerOfUS = [37.8, -96.9];
// const zoom = 4;
//
// window.map = L.mapbox.map('map', 'mapbox.streets')
//   .setView(centerOfUS, zoom);

// // temporary thing so that changing zipcode via UI updates query
// document.getElementById('zipcode').addEventListener('input', (event) => {
//   const value = event.target.value;
//   if (/^\d+$/.test(value) && value.length === 5) {
//     setHash({ zipcode: value });
//   }
// });
//
// // temporary thing for setting event type and start/end dates via JS
// // console, e.g. setHash({ eventType: 'hi', startDate: '2017-03-21'})
// window.setHash = setHash;
//
// // Boot:
//
// // FIXME this stuff will be split into A) the map component and B)
// // top level app state stuff which the event map and event list
// // are a function of.
// let eventsLayer = null;
//
// function plotAndZoom(filters) {
//
//   // wipe out existing plotted events -- probably this can
//   // be done more efficiently
//   if (eventsLayer) {
//     eventsLayer.clearLayers();
//   }
//
//   // compute filtered event set
//   const filteredEvents = getFilteredEvents(window.PEOPLEPOWER_EVENTS, filters);
//
//   // then plot those events
//   eventsLayer = plotEvents(filteredEvents, window.map);
//
//   // then adjust map position accordingly
//   setMapPositionBasedOnZip(
//     filters.zipcode,
//     window.KNOWN_ZIPCODES,
//     filteredEvents,
//     window.map
//   );
// }
//
// // Once initially on boot, based on initial filters in URL
// plotAndZoom(getHash());
//
// // Also when the event filters change
// onHashChange(plotAndZoom);
//
// // Now poll for new events data and when it arrives, update data
// pollForNewEvents(30000, (err) => {
//   if (!err) {
//     console.log('got new data!');
//     // window.PEOPLEPOWER_EVENTS has just been updated, so update the
//     // app state accordingly and let the UI react to that.
//   }
// });
