import Vue from 'vue';
import { getFilteredEvents } from 'src/util/events';
import mapMarker from 'src/assets/images/map_marker.png';
import mapStyles from 'src/assets/styles/mapbox_styles';
import geoJsonHelpers from 'turf-helpers';
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
        return store.getters.filteredEvents;
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
        const eventsSource = this.mapRef.getSource("events");

        if (eventsSource) {
          const eventsAsGeoJson = this.filteredEvents.map((event) => geoJsonHelpers.point([event.lng, event.lat]));
          eventsSource.setData(geoJsonHelpers.featureCollection(eventsAsGeoJson));
        }
      },

      setMapPositionBasedOnZip() {
        let latLng = this.zipcodes[this.filters.zipcode];
        if (latLng) latLng = [latLng[1], latLng[0]];
        const zoom = (latLng) ? 8 : this.initialZoom;

        this.mapRef.flyTo({
          center: latLng || this.initialCoordinates,
          zoom: zoom
        });
      },

      addCustomIcon(icon, name) {
        const img = new Image();
        img.src = icon;
        img.onload = function() {
          this.mapRef.addImage(name, img);
        }.bind(this);
      },

      createEmptyEventsDataSource() {
        this.mapRef.addSource("events", {
          "type": "geojson",
          "data": geoJsonHelpers.featureCollection([]),
          "cluster": true,
          "clusterMaxZoom": 8
        });
      },

      mapMounted() {
        this.createEmptyEventsDataSource();
        this.addCustomIcon(mapMarker, "custom-marker");
        mapStyles.forEach((style) => this.mapRef.addLayer(style));
        this.plotEvents();
      }
    },

    mounted() {
      this.mapRef = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/bright-v9',
        center: this.initialCoordinates,
        zoom: this.initialZoom
      });

      this.mapRef.addControl(new mapboxgl.NavigationControl());
      this.mapRef.on("load", this.mapMounted.bind(this));
    }
  })
}
