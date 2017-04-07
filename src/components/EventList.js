import Vue from 'vue';
import EventCard from 'src/components/EventCard';
import EventListItem from 'src/components/EventListItem';

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
        return store.getters.filteredEvents;
      },
      view() {
        return store.state.view;
      },
      selectedEventId() {
        return store.state.selectedEventId;
      },
      isSelectedZipcodeInvalid() {
        return this.filters.zipcode &&
          this.zipcodes &&
          !this.zipcodes[this.filters.zipcode];
      },
      noEventsText(){
        return "No events matched that search."
      },
      invalidZipcodeText() {
        return "Invalid zipcode."
      },
    },
    methods: {
      scrollIntoView(offsetTop) {
        if (this.$refs.root) {
          this.$refs.root.scrollTop = offsetTop + 2;
        }
      }
    },
    components: {
      'event-card': EventCard,
      'event-list-item': EventListItem
    }
  })
}
