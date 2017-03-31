<template>
  <div>
    <h5 v-if="showTitle" class="filter-events-title">Date of event</h5>
    <div class="filter-events-date-picker">
      <input type="text" v-model="startDate" />
      <strong>to</strong>
      <input type="text" v-model="endDate" />
    </div>
  </div>
</template>

<script>
import { setHash } from 'src/util/url-hash';

export default {
  name: 'event-type-filters',
  props: ['filters', 'showTitle'],
  data() {
    return {
      startDate: this.filters.startDate,
      endDate: this.filters.endDate
    };
  },
  watch: {
    startDate(newDate) {
      // FIXME ha ha
      if (/\d{4}-\d{2}-\d{2}/.test(newDate)) {
        setHash({ startDate: newDate });
      }
      if (!newDate) {
        setHash({ startDate: null });
      }
    },
    endDate(newDate) {
      // FIXME ha ha
      if (/\d{4}-\d{2}-\d{2}/.test(newDate)) {
        setHash({ endDate: newDate });
      }
      if (!newDate) {
        setHash({ endDate: null });
      }
    }
  }
}
</script>
