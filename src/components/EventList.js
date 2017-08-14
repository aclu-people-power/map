import Vue from 'vue';
import EventCard from 'src/components/EventCard';
import EventListItem from 'src/components/EventListItem';

export default function(store, opts){
  var options = opts || {};
  return new Vue({
    el: '#event-list',
    name: 'event-list',
    template: require('src/templates/EventList.html'),
    store,
    data: {
      source: options.source,
      akid: options.akid
    },
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
      eventTypes() {
        return store.state.eventTypes;
      },
      filteredEvents() {
        return store.getters.filteredEvents;
      },
      view() {
        return store.state.view;
      },
      selectedEventIds() {
        return store.state.selectedEventIds;
      },
      isSelectedZipcodeInvalid() {
        return this.filters.zipcode &&
          Object.keys(this.zipcodes).length &&
          !this.zipcodes[this.filters.zipcode];
      },
      noEventsText(){
        return "No events matched that search."
      },
      invalidZipcodeText() {
        return "Invalid zipcode."
      },
    },
    components: {
      'event-card': EventCard,
      'event-list-item': EventListItem
    }
  })
}
