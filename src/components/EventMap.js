import Vue from 'vue';
import { getFilteredEvents } from 'src/util/events';

// Attaches L (leaflet.js) to window.
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2VubmV0aHBlbm5pbmd0b24iLCJhIjoiY2l6bmJ3MmFiMDMzZTMzbDJtdGxkM3hveSJ9.w4iOGaL2vrIvETimSXUXsw';

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
       //   this.setMapPositionBasedOnZip();
        }
      },

      // zipcodes should only change once, and when they do,
      // if applicable, set the map position based on zip
      zipcodes(newZipcodes, oldZipcodes) {
        this.plotEvents();
       // this.setMapPositionBasedOnZip();
      },

      filters(newFilters, oldFilters) {
        this.plotEvents();

        // zoom to new location when zipcode changes
        if (newFilters.zipcode !== oldFilters.zipcode) {
         // this.setMapPositionBasedOnZip();
        } 
      }
    },
    methods: {
      plotEvents() {
        // FIXME needs API updated to mapbox gl!
        //
        // // wipe out existing plotted events -- probably this can
        // // be done more efficiently
        // if (this.eventsLayer) {
        //   this.eventsLayer.clearLayers();
        // }

        // this.eventsLayer = L.layerGroup().addTo(this.mapRef);

        // this.filteredEvents.forEach((event) => {
        //   L.circleMarker([event.lat, event.lng], {
        //     radius: 5,
        //     color: 'white',
        //     fillColor: '#ef3030',
        //     opacity: 0.8,
        //     fillOpacity: 0.7,
        //     weight: 2
        //   }).addTo(this.eventsLayer);
        // });
      },

      setMapPositionBasedOnZip() {
        // FIXME needs API updated to mapbox gl!
        //
        // if (!this.filters.zipcode || !this.zipcodes[this.filters.zipcode]) {

        //   this.setInitialMapPosition();
        //   return;
        // }

        // const latLng = this.zipcodes[this.filters.zipcode];
        // const zoom = 8;

        // this.mapRef.setView(latLng, zoom);
      },

      setInitialMapPosition() {
        const centerOfUS = [-96.9, 37.8];
        const zoom = 3;
        
        this.mapRef.panTo(centerOfUS, zoom);
      }
    },

    mounted() {
      const centerOfUS = [-96.9, 37.8];
      const zoom = 3;

      this.mapRef = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/basic-v9',
        center: centerOfUS,
        zoom
      });

      this.setInitialMapPosition();
    }
  })
}
