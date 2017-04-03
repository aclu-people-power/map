import Vue from 'vue';
import { getFilteredEvents } from 'src/util/events';
import mapMarker from 'src/templates/mapMarker.svg';

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
      initialCoordinates: [-96.9 , 37.8],
      initialZoom: 4
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

        this.filteredEvents.forEach((event) => {
          const el = document.createElement("div");
          el.className = "map-marker";
          el.innerHTML = mapMarker;
          new mapboxgl.Marker(el).setLngLat([event.lng, event.lat]).addTo(this.mapRef);
        });
      },

      setMapPositionBasedOnZip() {
        const latLng = this.zipcodes[this.filters.zipcode];
        const zoom = (latLng) ? 8 : this.initialZoom;

        this.mapRef.flyTo({
          center: latLng || this.initialCoordinates,
          zoom: zoom
        });
      }
    },

    mounted() {
      this.mapRef = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        center: this.initialCoordinates,
        zoom: this.initialZoom
      })
    }
  })
}
