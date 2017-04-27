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
        headerIsStuck: false,
        placeholderHeight: 0
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
      toggleFilterEvents: function() { this.isFilterEventsOpen = !this.isFilterEventsOpen },
      search(e) {
        const newZipcode = e.target.value;

        if (/^\d{5}$/.test(newZipcode) || !newZipcode) {
          store.dispatch('setFilters',{zipcode: newZipcode });
        }
      }
    },
    mounted() {
      const checkIfHeaderShouldBeSticky = function() {
        const headerHeight = (this.$refs.header) ? this.$refs.header.clientHeight : null;
        const shouldHeaderBeStuck = headerHeight && window.pageYOffset > headerHeight;
        if (this.headerIsStuck !== shouldHeaderBeStuck) {
          this.headerIsStuck = shouldHeaderBeStuck;
          if (shouldHeaderBeStuck == true && this.headerHeight !== this.$refs.header.clientHeight) {
            this.headerHeight = this.$refs.header.clientHeight;
          }
        }
      }.bind(this);

      window.setInterval(checkIfHeaderShouldBeSticky, 300);
    },
    components: {
      'event-type-filters': EventTypeFilters,
      'event-date-filters': EventDateFilters,
      'button-dropdown': ButtonDropdown,
    }
  })
}
