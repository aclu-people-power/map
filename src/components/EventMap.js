import Vue from 'vue';
import EventCard from 'src/components/EventCard';
import mapMarker from 'src/assets/images/map_marker.png';
import mapMarkerStar from 'src/assets/images/map_marker_star.png';
import mapLayers from 'src/assets/styles/mapbox_layers';
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
      initialCoordinates: [-96.9, 37.8],
      initialZoom: 3,
      boundsOfContinentalUS: [[-124.848974, 24.396308], [-66.885444, 49.384358]]
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
      geojsonEvents() {
        return geoJsonHelpers.featureCollection(
          this.filteredEvents.map(event =>
            geoJsonHelpers.point(
              [event.lng, event.lat],
              {
                id: event.id,
                isOfficial: !!event.is_official
              }
            )
          )
        );
      },
      view() {
        return store.state.view;
      }
    },
    watch: {
      events(newEvents, oldEvents) {
        this.plotEvents();
        this.resetMap();

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

        // mapbox will throw an error if we add data before the source has been added,
        // which may happen if the zipcodes load faster than mapbox-gl mounts
        if (eventsSource) {
          eventsSource.setData(this.geojsonEvents);
        }
      },

      setMapPositionBasedOnZip() {
        let latLng = this.zipcodes[this.filters.zipcode];
        if (latLng) latLng = [latLng[1], latLng[0]];
        const zoom = (latLng) ? 8 : this.initialZoom;

        if (latLng) {
          this.mapRef.flyTo({
            center: latLng,
            zoom
          });
        } else {
          this.mapRef.fitBounds(this.boundsOfContinentalUS);
        }
      },

      addCustomIcon(icon, name, layerId) {
        const img = new Image();
        img.src = icon;
        img.onload = () => {
          this.mapRef.addImage(name, img);
        };
        this.setCustomIconPixelRatio(layerId);
      },

      setCustomIconPixelRatio(layerId) {
        //Currently, mapbox-gl doesn't really care about the pixel ratio when
        //rendering icons, so we have to set it ourselves.
        const iconLayer = this.mapRef.getLayer(layerId)
        if (!window.devicePixelRatio || !iconLayer) return;
        iconLayer.setLayoutProperty("icon-size", iconLayer.getLayoutProperty("icon-size") * window.devicePixelRatio);
      },

      resetMap() {
        if (this.mapRef) {
          this.mapRef.resize();
        }
      },

      createEventsDataSource() {
        this.mapRef.addSource("events", {
          "type": "geojson",
          // Depending on the order in which things load,
          // this may be intitialized empty and may be ready to roll
          "data": this.geojsonEvents,
          "cluster": true,
          "clusterMaxZoom": 8
        });
      },

      // For all layers, we want the cursor to be a pointer on hover.
      setCursorStyleOnHover() {
        mapLayers.forEach(layer => {
          this.mapRef.on('mouseenter', layer.id, (e) => {
            this.mapRef.getCanvas().style.cursor = 'pointer';
          });

          this.mapRef.on('mouseleave', layer.id, (e) => {
            this.mapRef.getCanvas().style.cursor = '';
          });
        });
      },

      getPopupContent(eventId) {
        // Create a Vue instance _inside_ a mapbox Map instance
        // _inside_ another Vue instance WHOAH. The point is
        // to reuse the existing event card component.
        const vm = new Vue({
          template: '<event-card :event="event"></event-card>',
          data: {
            event: this.filteredEvents.find(ev => ev.id === eventId)
          },
          components: {
            'event-card': EventCard
          }
        }).$mount();

        return vm.$el;
      },

      openPopupsOnClick() {

        ['unclustered-points', 'stars'].forEach(layer => {

          this.mapRef.on('click', layer, (e) => {

            const eventId = e.features[0].properties.id;
            const eventCoordinates = e.features[0].geometry.coordinates;

            store.commit('eventSelected', eventId);

            let popupOptions = {};

            // If the viewport width is on the small side, let’s put
            // the popup on top of the marker and pan to it, so that
            // it will usually look ok. For larger screens the
            // popup is smart enough to usually Just Work.
            if (document.documentElement.clientWidth < 600) {
              popupOptions.anchor = 'bottom';

              const bounds = this.mapRef.getBounds();

              // The map’s height expressed in degrees of latitude
              const mapHeight = bounds.getNorth() - bounds.getSouth();

              // So pan to where that marker lives but centered a bit above it,
              // to account for the tooltip. .5 of the map height would put
              // the marker at the exact bottom edge of the screen; this is
              // adjusted to look a little better.
              this.mapRef.panTo([
                eventCoordinates[0],
                eventCoordinates[1] + (mapHeight * .4)
              ]);
            }

            new mapboxgl.Popup(popupOptions)
              .setLngLat(eventCoordinates)
              .setDOMContent(this.getPopupContent(eventId))
              .addTo(this.mapRef);
          });
        });
      },

      zoomOnClusterClick() {
        this.mapRef.on('click', 'clusters', (e) => {
          const feature = e.features[0];
          const currentZoom = this.mapRef.getZoom();

          this.mapRef.flyTo({
            center: feature.geometry.coordinates,
            zoom: currentZoom + 2,
            curve: 1
          });
        });
      },

      mapMounted() {
        this.resetMap();
        this.createEventsDataSource();

        mapLayers.forEach(layer =>
          this.mapRef.addLayer(layer)
        );

        this.setCursorStyleOnHover();
        this.openPopupsOnClick();
        this.zoomOnClusterClick();

        this.addCustomIcon(mapMarker, 'custom-marker', 'unclustered-points');
        this.addCustomIcon(mapMarkerStar, 'custom-marker-star', 'stars');

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
      this.mapRef.on("load", this.mapMounted);
    }
  })
}
