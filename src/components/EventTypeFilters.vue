<template>
  <div class="event-type-filters">
    <h5 class="event-filters-title">Type of event</h5>
    <div v-for="(label, type) in eventTypes">
      <input 
        type="checkbox" 
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
  computed: {
    eventTypes() {
      return eventTypes;
    },
    selectedEventTypes() {
      if (!this.filters.eventType) {
        return [];
      }
      return this.filters.eventType.split(',');
    }
  },
  methods: {
    updateSelectedEventTypes(type, event) {
      const selectedEventTypes = [...this.selectedEventTypes];

      if (event.target.checked) {
        selectedEventTypes.push(type);

      } else if (selectedEventTypes.includes(type)) {
        const idx = selectedEventTypes.indexOf(type);
        selectedEventTypes.splice(idx, 1);
      }

      setHash({ eventType: selectedEventTypes.join(',') });
    }
  }
}
</script>
