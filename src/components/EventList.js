import Vue from 'vue';
import { getFilteredEvents } from 'src/util/events';
import EventCard from 'src/components/EventCard';

export default function(store){
  return new Vue({
    el: '#event-list',
    name: 'event-list',
    template: require('src/templates/EventList.html'),
    store,
    computed: {
      events() {
        return store.state.events;
      },
      filters() {
        return store.state.filters;
      },
      zipcodes() {
        return store.state.zipcodes;
      },
      filteredEvents() {
        return getFilteredEvents(this.events, this.filters, this.zipcodes)
      },
      view() {
        return store.state.view;
      }
    },
    components: {
      'event-card': EventCard
    }
  })
}
