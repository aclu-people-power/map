import Vue from 'vue';
import { getFilteredEvents } from 'src/util/events';
import mapMarker from '../assets/images/map-marker.svg';

// Attaches L (leaflet.js) to window.
import 'mapbox.js';

L.mapbox.accessToken = 'pk.eyJ1Ijoia2VubmV0aHBlbm5pbmd0b24iLCJhIjoiY2l6bmJ3MmFiMDMzZTMzbDJtdGxkM3hveSJ9.w4iOGaL2vrIvETimSXUXsw';

export default function(store){
  return new Vue({
    el: '#event-map',
    name: 'event-map',
    template: require('src/templates/EventMap.html'),
    store,
    data: {
      mapRef: null,
      eventsLayer: null,
    },
    computed: {
      events() {
        return store.state.events;
      },
      zipcodes() {
        return store.state.zipcodes;
      },
      filters() {
        return store.state.filters;
      },
      filteredEvents() {
        return getFilteredEvents(this.events, this.filters, this.zipcodes);
      },
      view() {
        return store.state.view;
      }
    },
    watch: {
      events(newEvents, oldEvents) {
        this.plotEvents();

        // events data just showed up on app boot, if applicable
        // set the map position based on zip
        if (newEvents.length && !oldEvents.length) {
          this.setMapPositionBasedOnZip();
        }
      },

      // zipcodes should only change once, and when they do,
      // if applicable, set the map position based on zip
      zipcodes(newZipcodes, oldZipcodes) {
        this.plotEvents();
        this.setMapPositionBasedOnZip();
      },

      filters(newFilters, oldFilters) {
        this.plotEvents();

        // zoom to new location when zipcode changes
        if (newFilters.zipcode !== oldFilters.zipcode) {
          this.setMapPositionBasedOnZip();
        }
      }
    },
    methods: {
      plotEvents() {
        // wipe out existing plotted events -- probably this can
        // be done more efficiently
        if (this.eventsLayer) {
          this.eventsLayer.clearLayers();
        }

        this.eventsLayer = L.layerGroup().addTo(this.mapRef);

        this.filteredEvents.forEach((event) => {
          L.marker([event.lat, event.lng], {
             icon: L.icon({
               iconUrl: mapMarker,
               iconSize: [22,22],
               iconAnchor: [11, 22],
               className: 'map-marker'
             }),
          }).addTo(this.eventsLayer);
        });
      },

      setMapPositionBasedOnZip() {
        if (!this.filters.zipcode || !this.zipcodes[this.filters.zipcode]) {

          this.setInitialMapPosition();
          return;
        }

        const latLng = this.zipcodes[this.filters.zipcode];
        const zoom = 8;

        this.mapRef.setView(latLng, zoom);
      },

      setInitialMapPosition() {
        const centerOfUS = [37.8, -96.9];
        const zoom = 4;

        this.mapRef.setView(centerOfUS, zoom);
      }
    },

    mounted() {
      this.mapRef = L.mapbox.map('map', 'mapbox.streets');
      this.setInitialMapPosition();
    }
  })
}
