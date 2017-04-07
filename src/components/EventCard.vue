<template>
  <div class="event-card inner-wrap">
    <div v-if="labels.length" class="event-card-labels">
      <span v-for="label in labels" class="event-card-label">
        {{label}}
      </span>
    </div>
    <h3 class="event-card-title">
      {{event.title}}
    </h3>
    <div class="event-card-date">
      {{date}}
    </div>
    <div class="event-card-venue">
      {{event.venue}}
    </div>
    <div v-if="hasCapacity">
      <a class="btn event-card-cta" :href="url" target="_blank">RSVP</a>
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
    hasCapacity() {
      return this.event.attendee_count < this.event.max_attendees;
    },
    labels() {
      if (!this.event.categories) {
        return [];
      }

      return this.event.categories.split(',')
        .map(event => eventTypes[event])
        .filter(Boolean);
    },
    url() {
      return `https://go.peoplepower.org/event/${this.event.campaign}/${this.event.id}`;
    }
  }
}
</script>
