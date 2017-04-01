import Vue from 'vue';
import { setHash } from 'src/util/url-hash';
import EventTypeFilters from 'src/components/EventTypeFilters';
import EventDateFilters from 'src/components/EventDateFilters';
import ButtonDropdown from 'src/components/ButtonDropdown';

export default function(store){
  return new Vue({
    name: 'header',
    store,
    el: "#header",
    template: require('src/templates/Header.html'),
    data() {
      return {
        isFilterEventsOpen: false,
        zipcode: store.state.filters.zipcode,
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
      toggleButtonText() {
        return this.view === 'map' ? 'List view' : 'Map view'
      }
    },
    methods: {
      toggleView() {
        store.commit('viewToggled');
      },
      toggleFilterEvents() {
        // When opening, calculate where to position it based on
        // cta’s position.
        if (!this.isFilterEventsOpen) {
          const position = this.$refs.cta.getBoundingClientRect().top;
          // This is to account for the large empty on the top of this
          // font included in its line height // (wish I knew the right word...)
          const adjustment = 10;
          this.filterEventsTop.top = `${position + adjustment}px`;
        }

        this.isFilterEventsOpen = !this.isFilterEventsOpen;
      },
      search() {
        setHash({ zipcode: this.zipcode });
      }
    },
    watch: {
      zipcode(newZipcode) {
        if (/^\d+$/.test(newZipcode) && newZipcode.length === 5) {
          setHash({ zipcode: newZipcode });
        }
      }
    },
    components: {
      'event-type-filters': EventTypeFilters,
      'event-date-filters': EventDateFilters,
      'button-dropdown': ButtonDropdown,
    }
  })
}
