<template>
  <div v-if="isFilterEventsOpen">
    <div class="filter-events" :style="filterEventsTop">
      <div class="filter-events-header">
        <span>Filter events</span>
        <span class="filter-events-close" @click="toggleFilterEvents">
          ✖
        </span>
      </div>
      <div class="filter-events-body">
        <event-date-filters :show-title="true" :filters="filters" ></event-date-filters>
        <event-type-filters :event-types="eventTypes" :show-title="true" :filters="filters"></event-type-filters>
        <button
          class="filter-events-search"
          @click="toggleFilterEvents"
        >
          Search events
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import EventTypeFilters from 'src/components/EventTypeFilters';
import EventDateFilters from 'src/components/EventDateFilters';

export default {
  name: 'mobile-event-filters',
  props: [
    'isFilterEventsOpen', 'filterEventsTop', 'toggleFilterEvents', 'filters', 'eventTypes'
  ],
  components: {
    'event-type-filters': EventTypeFilters,
    'event-date-filters': EventDateFilters,
  }
}
</script>
