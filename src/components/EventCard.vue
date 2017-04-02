<template>
  <div class="event-card inner-wrap">
    <span v-for="label in labels" class="event-card-label">
      {{label}}
    </span>
    <h4 class="event-card-title">
      {{event.title}}
    </h4>
    <div class="event-card-date">
      {{date}}
    </div>
    <div class="event-card-venue">
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

// e.g. Tuesday, Mar 21 6:30pm
const displayDateFormat = 'dddd, MMM D h:mma';

export default {
  name: 'event-card',
  props: ['event'],
  computed: {
    date() {
      return moment(this.event.start_datetime).format(displayDateFormat);
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
