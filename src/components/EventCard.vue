<template>
  <div>
    <div>
      <div v-for="label in labels">
        <span class="event-card-label">
          {{label}}
        </span>
      </div>
    </div>
    <h4 class="event-card-title">
      {{event.title}}
    </h4>
    <div>
      {{date}}
    </div>
    <div>
      {{event.venue}}
    </div>
    <div>
      <a class="btn" v-bind:href="event.url" target="_blank">RSVP</a>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { eventTypes } from 'src/util/events';

export default {
  name: 'event-card',
  props: ['event'],
  computed: {
    date() {
      return moment(this.event.start_datetime).format('YYYY-MM-DD');
    },
    labels() {
      if (!this.event.categories) {
        return [];
      }

      return this.event.categories.split(',')
        .map(event => eventTypes[event])
        .filter(Boolean);
    }
  }
}
</script>
