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
        // Display the teams on the list only if
        // that's the ONLY event type we're filtering by
        let events = store.getters.filteredEvents;
        if (this.filters.eventType === 'teams') {
          return events;
        } else {
          return events.filter(event => !event.is_team);
        }
      },
      view() {
        return store.state.view;
      },
      selectedEventIds() {
        return store.state.selectedEventIds;
      },
      hoveredEventIds() {
        return store.state.hoveredEventIds;
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
