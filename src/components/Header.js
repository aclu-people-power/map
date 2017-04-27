import Vue from 'vue';
import EventTypeFilters from 'src/components/EventTypeFilters';
import EventDateFilters from 'src/components/EventDateFilters';
import ButtonDropdown from 'src/components/ButtonDropdown';
import MobileEventFilters from 'src/components/MobileEventFilters';

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
        headerIsStuck: false,
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
      },
      headerPlaceholderStyle() {
        return { height: this.headerHeight() + 'px' }
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
      headerHeight: function() {
        return (this.$refs.header) ? this.$refs.header.clientHeight : null;
      },
      checkIfHeaderShouldBeStuck() {
        const headerHeight = this.headerHeight();
        this.headerIsStuck = headerHeight && window.pageYOffset > headerHeight + this.stickyBuffer;
      },
      handleScroll: function() {
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => this.checkIfHeaderShouldBeStuck(), 25);
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
    },

    components: {
      'event-type-filters': EventTypeFilters,
      'event-date-filters': EventDateFilters,
      'button-dropdown': ButtonDropdown,
      'mobile-event-filters': MobileEventFilters,
    }
  })
}
