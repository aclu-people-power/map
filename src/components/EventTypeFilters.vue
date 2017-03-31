<template>
  <div>
    <h5 class="filter-events-title">Type of event</h5>
    <div 
      class="filter-events-checkbox" 
      v-for="(label, type) in eventTypes"
    >
      <input
        type="checkbox" 
        v-model="selectedEventTypes"
        class="no-margin-checkbox"
        :value="type"
        :checked="selectedEventTypes.includes(type)" 
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
