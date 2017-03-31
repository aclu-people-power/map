<template>
  <div class="event-type-filters">
    <h5 class="event-filters-title">Type of event</h5>
    <div v-for="(label, type) in eventTypes">
      <input
        type="checkbox" 
        v-model="selectedEventTypes"
        class="no-margin-checkbox"
        :checked="selectedEventTypes.includes(type)" 
        @change="updateSelectedEventTypes(type, $event)"
      /> 
      {{label}}
    </div>
  </div>
</template>

<script>
import { eventTypes } from 'src/util/events';
import { setHash } from 'src/util/url-hash';

export default {
  name: 'event-type-filters',
  props: ['filters'],
  data() {
    return {
      selectedEventTypes: this.filters.eventType ? 
        this.filters.eventType.split(',') : []
    };
  },
  computed: {
    eventTypes() {
      return eventTypes;
    }
  },
  watch: {
    selectedEventTypes(newSelectedEventTypes) {
      setHash({ eventType: newSelectedEventTypes.join(',') });
    }
  }
}
</script>
