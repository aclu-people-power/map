<template>
  <div class="event-date-filters">
    <h5 class="event-filters-title">Date of event</h5>
    <input 
      type="text" 
      placeholder="from"
      :value="startDate"
      @input="updateSelectedStartDate"
    />
    <input 
      type="text" 
      placeholder="to"
      :value="endDate"
      @input="updateSelectedEndDate"
    />
  </div>
</template>

<script>
import { setHash } from 'src/util/url-hash';

export default {
  name: 'event-type-filters',
  props: ['filters'],
  computed: {
    startDate() {
      this.filters.startDate;
    },
    endDate() {
      this.filters.endDate;
    }
  },
  methods: {
    updateSelectedStartDate(event) {
      const newDate = event.target.value;
      // FIXME ha ha
      if (/\d{4}-\d{2}-\d{2}/.test(newDate)) {
        setHash({ startDate: newDate });
      }
    },
    updateSelectedEndDate(event) {
      const newDate = event.target.value;
      // FIXME ha ha
      if (/\d{4}-\d{2}-\d{2}/.test(newDate)) {
        setHash({ endDate: newDate });
      }
    }
  }
}
</script>
