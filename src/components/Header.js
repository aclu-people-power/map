import Vue from 'vue';
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
      search(e) {
        const newZipcode = e.target.value;

        if (/^\d{5}$/.test(newZipcode) || !newZipcode) {
          store.commit('setFilters',{zipcode: newZipcode });
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
