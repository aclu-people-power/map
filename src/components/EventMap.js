import Vue from 'vue';
import { getFilteredEvents } from 'src/util/events';

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
    methods: {
      plotAndZoom() {

        // wipe out existing plotted events -- probably this can
        // be done more efficiently
        if (this.eventsLayer) {
          this.eventsLayer.clearLayers();
        }

        // then plot those events
        this.plotEvents();

        // then adjust map position accordingly
        this.setMapPositionBasedOnZip();
      },

      plotEvents() {
        this.eventsLayer = L.layerGroup().addTo(this.mapRef);

        this.filteredEvents.forEach((event) => {
          L.circleMarker([event.lat, event.lng], {
            radius: 5,
            color: 'white',
            fillColor: '#ef3030',
            opacity: 0.8,
            fillOpacity: 0.7,
            weight: 2
          }).addTo(this.eventsLayer);
        });
      },

      setMapPositionBasedOnZip() {
        if (!store.state.filters.zipcode || 
            !store.state.zipcodes[store.state.filters.zipcode]) {
          return;
        }

        const latLng = store.state.zipcodes[store.state.filters.zipcode];
        const zoom = 8;

        this.mapRef.setView(latLng, zoom);
      }
    },

    mounted() {
      const centerOfUS = [37.8, -96.9];
      const zoom = 4;

      this.mapRef = L.mapbox.map('map', 'mapbox.streets')
        .setView(centerOfUS, zoom);
    },

    updated() {
      // NOTE: this is a bit heavy handed, we do not really want to
      // always zoom
      this.plotAndZoom();
    } 
  })
}
