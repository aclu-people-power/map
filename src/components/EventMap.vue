<template>
  <h2 id="event-map">
    EVENT MAP with {{events.length}} events loaded and {{numZips}} valid zips
  </h2>
</template>

<script>
  import codes from 'json-loader!src/data/us_postal_codes'
  import { pollForNewEvents, loadEvents } from 'src/util/events-poll';
  export default {
    name: 'event-map',
    props: ['loaded', 'updateEvents', 'events', 'updateCodes', 'codes'],
    computed: {
      numZips: function(){
        return Object.keys(this.codes).length
      }
    },
    mounted: function () {
      this.loaded();
      this.updateCodes(codes);
      loadEvents(() => {
        console.debug('success!');
        this.updateEvents(window.PEOPLEPOWER_EVENTS);
      })
    }
  }
</script>
