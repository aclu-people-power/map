import Vue from 'vue';
import EventTypeFilters from 'src/components/EventTypeFilters';
import EventDateFilters from 'src/components/EventDateFilters';
import ButtonDropdown from 'src/components/ButtonDropdown';
import MobileEventFilters from 'src/components/MobileEventFilters';
import querystring from 'querystring';

export default function(store, opts){
  var options = opts || {};
  return new Vue({
    name: 'header',
    store,
    el: "#header",
    template: require('src/templates/Header.html'),
    data() {
      return {
        logoFile: options.logoFile,
        hostEventLink: options.hostEventLink,
        isFilterEventsOpen: false,
        // Where to position the expanded event filtering UI
        // for smaller screens
        filterEventsTop: { top: 0 },
        source: options.source,
        akid: options.akid
      };
    },
    computed: {
      view() {
        return store.state.view;
      },
      filters() {
        return store.state.filters;
      },
      eventTypes() {
        return store.state.eventTypes;
      },
      toggleButtonText() {
        return this.view === 'map' ? 'List view' : 'Map view'
      }
    },
    methods: {
      toggleView() {
        store.commit('viewToggled');
      },
      toggleFilterEvents: function() { this.isFilterEventsOpen = !this.isFilterEventsOpen },
      search(e) {
        const newZipcode = e.target.value;

        if (/^\d{5}$/.test(newZipcode) || !newZipcode) {
          store.dispatch('setFilters',{zipcode: newZipcode });
        }
      },
      updateFilters() {
        const newFilters = querystring.parse(window.location.search.replace(/^\?/, ''))
        if (newFilters != store.state.filters) {
          store.dispatch('setFilters', newFilters);
        }
      }
    },
    created() {
      window.addEventListener('popstate', this.updateFilters);
    },
    beforeDestroy() {
      window.addEventListener('popstate', this.updateFilters);
    },
    components: {
      'event-type-filters': EventTypeFilters,
      'event-date-filters': EventDateFilters,
      'button-dropdown': ButtonDropdown,
      'mobile-event-filters': MobileEventFilters,
    }
  })
}
