<template>
  <div>
    <h5 v-if="showTitle" class="filter-events-title">Type of event</h5>
    <div
      class="filter-events-item"
      v-for="(label, type) in eventTypes"
    >
      <label :for="type" class="filter-events-checkbox">
        <input
          type="checkbox"
          v-model="selectedEventTypes"
          class="no-margin-checkbox"
          :value="type"
          :id="type"
          :checked="selectedEventTypes.includes(type)"
        />
        <span></span>
        {{ label }}
      </label>
    </div>
  </div>
</template>

<script>

export default {
  name: 'event-type-filters',
  props: ['filters', 'showTitle', 'eventTypes'],
  computed: {
    selectedEventTypes: {
      get(){
        return this.filters.eventType ? this.filters.eventType.split(',') : []
      },
      set(newEventTypes){
        this.$store.dispatch('setFilters',{ eventType: newEventTypes.join(',') });
      }
    }
  }
}
</script>
