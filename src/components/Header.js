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
        headerHeight: null,
        stickyBuffer: 100
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
      handleScroll: function() {
        clearTimeout(this.scrollTimeout);

        this.scrollTimeout = setTimeout(() => {
          this.headerHeight = (this.$refs.header) ? this.$refs.header.clientHeight : null;
          this.headerIsStuck = this.headerHeight && this.view === 'list' && window.pageYOffset > this.headerHeight + this.stickyBuffer;
        }, 100)
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
    },

    components: {
      'event-type-filters': EventTypeFilters,
      'event-date-filters': EventDateFilters,
      'button-dropdown': ButtonDropdown,
    }
  })
}
