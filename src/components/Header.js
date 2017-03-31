import Vue from 'vue';
import { setHash } from 'src/util/url-hash';
import EventTypeFilters from 'src/components/EventTypeFilters';
import EventDateFilters from 'src/components/EventDateFilters';

export default function(store){
  return new Vue({
    name: 'header',
    store,
    el: "#header",
    template: require('src/templates/Header.html'),
    data() {
      return {
        isFilterEventsOpen: false,
        isFilterEventsByDateOpen: false,
        zipcode: store.state.filters.zipcode,
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
        this.isFilterEventsOpen = !this.isFilterEventsOpen;
      },
      toggleFilterEventsByDate() {
        this.isFilterEventsByDateOpen = !this.isFilterEventsByDateOpen;
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
      'event-date-filters': EventDateFilters
    }
  })
}
