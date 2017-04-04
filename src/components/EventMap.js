import Vue from 'vue';
import { getFilteredEvents } from 'src/util/events';
import mapMarker from 'src/templates/mapMarker.svg';
import helpers from 'turf-helpers';

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
          const eventsAsGeoJson = this.filteredEvents.map((event) => helpers.point([event.lng, event.lat]));
          eventsSource.setData(helpers.featureCollection(eventsAsGeoJson));
        }
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
        style: 'mapbox://styles/mapbox/bright-v9',
        center: this.initialCoordinates,
        zoom: this.initialZoom
      });

      this.mapRef.on("load", function(){
        this.mapRef.addSource("events", {
          "type": "geojson",
          "data": helpers.featureCollection([]),
          "cluster": true,
          "clusterMaxZoom": 8
        });

        this.mapRef.addLayer({
          "id": "unclustered-points",
          "type": "symbol",
          "source": "events",
          "filter": ["!has", "point_count"],
          "layout": {
              "icon-image": "marker-15",
              "icon-size": 1.5
          }
        });

        this.mapRef.addLayer({
          "id": "unclustered",
          "type": "circle",
          "source": "events",
          "paint": {
            "circle-color": "#ff4b4d",
            "circle-radius": 12
          },
          "filter": [">=", "point_count", 1]
        });

        this.mapRef.addLayer({
          "id": "cluster-count",
          "type": "symbol",
          "source": "events",
          "layout": {
              "text-field": "{point_count}",
              "text-font": [
                  "DIN Offc Pro Medium",
                  "Arial Unicode MS Bold"
              ],
              "text-size": 12
          }
        });

        this.plotEvents();
      }.bind(this))
    }
  })
}
