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
        scrollPosition: window.pageYOffset,
        headerHeight: 0
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
      },
      shouldBeSticky() {
        return this.scrollPosition > this.headerHeight;
      },
    },
    methods: {
      toggleView() {
        store.commit('viewToggled');
      },
      toggleFilterEvents: function() { this.isFilterEventsOpen = !this.isFilterEventsOpen },
      updateScrollPosition: function() {
        this.scrollPosition = window.pageYOffset;
        this.headerHeight = (this.$refs.header) ? this.$refs.header.clientHeight : 0;
      },
      search(e) {
        const newZipcode = e.target.value;

        if (/^\d{5}$/.test(newZipcode) || !newZipcode) {
          store.dispatch('setFilters',{zipcode: newZipcode });
        }
      }
    },
    mounted() {
      window.setInterval(this.updateScrollPosition, 300);
    },
    components: {
      'event-type-filters': EventTypeFilters,
      'event-date-filters': EventDateFilters,
      'button-dropdown': ButtonDropdown,
    }
  })
}
