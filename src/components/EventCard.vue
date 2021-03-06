<template>
  <div class="event-card inner-wrap">
    <div v-if="hasLabels" class="event-card-labels">
      <span v-if="event.is_official" class="event-card-label">
        <i class="icon-star-full"></i> Official ACLU Event
      </span>
      <span v-for="label in categoryLabels" class="event-card-label">
        {{label}}
      </span>
    </div>
    <div v-if="event.is_team" class="event-card-labels">
      <span class="event-card-label">
        People Power Team
      </span>
    </div>
    <h3 class="event-card-title">
      <a :href="url" target="_blank">{{event.title}}</a>
    </h3>
    <div class="event-card-date">
      <span v-if="event.is_team">Established</span> {{date}}
    </div>
    <div v-if="event.is_team" class="event-card-venue">
      <span v-if="event.attendee_count > 1">
        {{event.attendee_count}}
        member<template v-if="event.attendee_count != 1">s</template>
      </span>
    </div>
    <div v-else class="event-card-venue">
      {{event.venue}}
    </div>
    <div v-if="hasCapacity">
      <a class="btn event-card-cta" :href="url" target="_blank">
        <template v-if="event.is_team">Contact This Team</template>
        <template v-else>RSVP</template>
      </a>
    </div>
  </div>
</template>

<script>

import moment from 'moment';

// e.g. Tuesday, Mar 21 6:30pm
const displayDateFormat = 'dddd, MMM D h:mma';

export default {
  name: 'event-card',
  props: ['event', 'eventTypes', 'source', 'akid'],
  computed: {
    date() {
      if (this.event.is_team) {
        return moment(this.event.start_datetime).format('MMM YYYY'); 
      } else {
        return moment(this.event.start_datetime).format(displayDateFormat);
      }
    },
    hasCapacity() {
      return this.event.attendee_count < this.event.max_attendees;
    },
    hasLabels() {
      return this.event.is_official || this.event.categories || this.event.is_team;
    },
    categoryLabels() {
      const categories = this.event.categories ?
        this.event.categories.split(',') :
        [];

      return categories.map(category => this.eventTypes[category])
        .filter(Boolean);
    },
    url() {
      return `https://go.peoplepower.org/event/${this.event.campaign}/${this.event.id}?source=${this.source}&akid=${this.akid}`;
    }
  }
}
</script>
