import Vue from 'vue';
import EventTypeFilters from 'src/components/EventTypeFilters';
import EventDateFilters from 'src/components/EventDateFilters';
import ButtonDropdown from 'src/components/ButtonDropdown';
import MobileEventFilters from 'src/components/MobileEventFilters';

export default function(store, opts){
  var options = opts || {};
  return new Vue({
    name: 'header',
    store,
    el: "#header",
    template: require('src/templates/Header.html'),
    data() {
      return {
        showACLU: options.showACLU,
        isFilterEventsOpen: false,
        // Where to position the expanded event filtering UI
        // for smaller screens
        filterEventsTop: { top: 0 },
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
      }
    },
    components: {
      'event-type-filters': EventTypeFilters,
      'event-date-filters': EventDateFilters,
      'button-dropdown': ButtonDropdown,
      'mobile-event-filters': MobileEventFilters,
    }
  })
}
