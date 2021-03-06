import Vue from 'vue';
import EventCard from 'src/components/EventCard';
import geoJsonHelpers from 'turf-helpers';
import mapboxgl from 'mapbox-gl';
import teamIcon from 'assets/images/team-icon.png';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWNsdSIsImEiOiJjamg3eGkxbGQwMmcwMnhvZHZzaW9mMGhqIn0.jB-HL4A6ApAOranK3otJig';

export default function(store, opts){
  var options = opts || {};
  return new Vue({
    el: '#event-map',
    name: 'event-map',
    template: require('src/templates/EventMap.html'),
    store,
    data: {
      mapRef: null,
      eventsLayer: null,
      initialCoordinates: [-96.9, 37.8],
      initialZoom: window.outerWidth >= 1000 ? 3 : 1,
      boundsOfContinentalUS: [[-124.848974, 24.396308], [-66.885444, 49.384358]],
    },
    computed: {
      events() {
        return store.state.events;
      },
      map() {
        return store.state.map;
      },
      zipcodes() {
        return store.state.zipcodes;
      },
      us_states() {
        return store.state.us_states;
      },
      eventTypes() {
        return store.state.eventTypes;
      },
      filters() {
        return store.state.filters;
      },
      filteredEvents() {
        return store.getters.filteredEvents;
      },
      geojsonTeams() {
        return geoJsonHelpers.featureCollection(
          this.filteredEvents.filter(event => event.is_team).map(event =>
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
      geojsonEvents() {
        return geoJsonHelpers.featureCollection(
          this.filteredEvents.filter(event => !event.is_team).map(event =>
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

        // events data just showed up on app boot, if applicable
        // set the map position based on zip
        if (newEvents.length && !oldEvents.length) {
          this.setMapPositionBasedOnFilters();
        }
      },

      // zipcodes should only change once, and when they do,
      // if applicable, set the map position based on zip
      map(newMap, oldMap) {
        this.plotEvents();
      },
      
      zipcodes(newZipcodes, oldZipcodes) {
        this.plotEvents();
        this.setMapPositionBasedOnFilters()
      },

      us_states(newStates, oldStates) {
        this.setMapPositionBasedOnFilters();
      },

      filters(newFilters, oldFilters) {
        this.plotEvents();

        // zoom to new location when zipcode changes
        if (newFilters.zipcode !== oldFilters.zipcode) {
          this.setMapPositionBasedOnFilters();
        }

        if (newFilters.us_state !== oldFilters.us_state) {
          this.setMapPositionBasedOnFilters();
        }
      },

      // when the map is toggled to, make sure to resize accordingly
      view(newView, oldView) {
        if (newView !== oldView && newView === 'map' && this.mapRef) {
          Vue.nextTick(() => this.mapRef.resize());
        }
      }
    },
    methods: {
      plotEvents() {
        if (!this.mapRef) return;

        const eventsSource = this.mapRef.getSource("events");

        // mapbox will throw an error if we add data before the source has been added,
        // which may happen if the zipcodes load faster than mapbox-gl mounts
        if (eventsSource) {
          eventsSource.setData(this.geojsonEvents);
        }

        const teamsSource = this.mapRef.getSource("teams");

        if (teamsSource) {
          teamsSource.setData(this.geojsonTeams);
        }
      },

      setMapPositionBasedOnFilters() {
        if (!this.mapRef) return;

        const zipcodeCoordinates = this.zipcodes[this.filters.zipcode];

        if (zipcodeCoordinates) {
          this.mapRef.flyTo({
            center: zipcodeCoordinates,
            zoom: 8
          });
        } else {
          const state_abbr = this.filters.us_state || '';
          const us_state = this.us_states[state_abbr.toUpperCase()];
          if (us_state && us_state.bounds) {
            this.mapRef.fitBounds(us_state.bounds);
          } else {
            this.mapRef.fitBounds(this.boundsOfContinentalUS);
          }
        }
      },

      createEventsDataSource() {
        this.mapRef.addSource("teams", {
          "type": "geojson",
          "data": this.geojsonTeams
        });
        
        this.mapRef.addSource("events", {
          "type": "geojson",
          // Depending on the order in which things load,
          // this may be intitialized empty and may be ready to roll
          "data": this.geojsonEvents,
        });
      },

      // For all layers, we want the cursor to be a pointer on hover.
      setCursorStyleOnHover() {
        this.mapRef.on('mouseenter', 'points', (e) => {
          this.mapRef.getCanvas().style.cursor = 'pointer';
          const eventIds = e.features.map(feature =>
                                          feature.properties.id)
                .reverse();
          store.commit('eventHovered', eventIds);
        });

        this.mapRef.on('mouseleave', 'points', (e) => {
          this.mapRef.getCanvas().style.cursor = '';
        });
      },

      getPopupContent(eventIds) {
        // Create a Vue instance _inside_ a mapbox Map instance
        // _inside_ another Vue instance WHOAH. The point is
        // to reuse the existing event card component.

        const filteredEvents = this.filteredEvents;
        const eventTypes = this.eventTypes;
        
        let eventCard = document.createElement("div");
        eventCard.className = "event-card-wrapper";

        eventIds.forEach(function(eventId, i) {
          const vm = new Vue({
            template: '<event-card :event="event" :event-types="eventTypes" :source="source" :akid="akid"></event-card>',
            data: {
              event: filteredEvents.find(ev => ev.id === eventId),
              eventTypes: eventTypes,
              source: options.source,
              akid: options.akid
            },
            components: {
              'event-card': EventCard
            }
          }).$mount();

          eventCard.appendChild(vm.$el);
          if (i !== eventIds.length - 1) {
            eventCard.appendChild(document.createElement("hr"));
          }
        });
        
        return eventCard;
        
      },

      openPopupsOnClick(e) {
        const eventIds = e.features.map(feature =>
                                        feature.properties.id)
              .reverse();
        // the map's features are last-in-first-out,
        // and we want to display the list first-in-first-out,
        // so we need to reverse the display order
        
        const eventCoordinates = e.features[0].geometry.coordinates;
        
        store.commit('eventSelected', eventIds);
        
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
          .setDOMContent(this.getPopupContent(eventIds))
          .addTo(this.mapRef);
      },
      
      bindOpenPopupsOnClick() {
        this.mapRef.on('click', 'teams', this.openPopupsOnClick)        
        this.mapRef.on('click', 'points', this.openPopupsOnClick)
      },

      mapChanged() {
        store.dispatch('setMap', {
          map: this.mapRef.getBounds().toArray()
        });
      },
      
      mapMounted() {
        let that = this;
        that.mapRef.loadImage(teamIcon, function(err, image) {
          that.mapRef.addImage('teams', image);
            
          that.$refs.map.className = that.$refs.map.className.replace('-loading', '');

          that.createEventsDataSource();

          that.mapRef.addLayer({
            id: 'teams',
            type: 'symbol',
            source: 'teams',
            "layout": {
              "icon-image": "teams"
            }
          });
          
          that.mapRef.addLayer({
            id: 'points',
            type: 'circle',
            source: 'events',
            paint: {
              'circle-color': '#ffaa34',
              'circle-radius': 6,
              'circle-stroke-width': 2,
              'circle-stroke-color': 'white'
            }
          });
          
          that.setCursorStyleOnHover();
          that.bindOpenPopupsOnClick();
          
          that.plotEvents();
        });
      }
    },

    mounted() {
      this.mapRef = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/aclu/cjh7yjsth0bfc2rr3foas72zn',
        center: this.initialCoordinates,
        zoom: this.initialZoom
      });

      this.mapRef.addControl(new mapboxgl.NavigationControl());
      this.mapRef.on("load", this.mapMounted);
      this.mapRef.on("zoomend", this.mapChanged);
      this.mapRef.on("moveend", this.mapChanged);            
    }
  })
}
