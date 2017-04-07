<template>
  <div class='event-date-filters'>
    <h5 v-if="showTitle" class="filter-events-title">Date of event</h5>
    <div class="filter-events-date-picker">
      <div class='date-picker-header'>
        <input
          v-on:click="currentCalendar = 'startDate'"
          v-on:blur="deactivate"
          ref="startDate"
          type="text"
          :value="startDate"
        />
        <strong>to</strong>
        <input
          v-on:click="currentCalendar = 'endDate'"
          v-on:blur="deactivate"
          ref="endDate"
          type="text"
          :value="endDate"
        />
      </div>
      <div :class="['calendar-container', { active: isActive }]">
        <div class='calendar-panel' v-show="currentCalendar === 'startDate'" ref='startCalendar' />
        <div class='calendar-panel' v-show="currentCalendar === 'endDate'" ref='endCalendar' />
      </div>
    </div>
  </div>
</template>

<script>

import moment from 'moment';
import Pikaday from 'pikaday';

// e.g., 2017-03-01
const inputFormat = 'YYYY-MM-DD';

// e.g., Mar 1, 2017
const displayFormat = 'MMM D, YYYY';
const forDisplay = (date) => {
  if (date) {
    return moment(date, inputFormat).format(displayFormat);
  } else {
    return null;
  }
}

// Pikaday needs all of these i18n values just to override the weekdays to
// be single letters.  Everything is default except `weekdaysShort`
const calendarFormat = {
  previousMonth: 'Previous Month',
  nextMonth: 'Next Month',
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  weekdays: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  weekdaysShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
};

export default {
  name: 'event-date-filters',
  props: ['filters', 'showTitle'],
  computed: {
    startDate: {
      get() {
        return forDisplay(this.$store.state.filters.startDate);
      },
      set(value) {
        this.$store.commit('setFilters',{ startDate: value });
      }
    },
    isActive: function() { return !!this.currentCalendar },
    endDate: {
      get(){
        return forDisplay(this.$store.state.filters.endDate);
      },
      set(value){
        this.$store.commit('setFilters',{ endDate: value })
      }
    }
  },
  methods: {
    deactivate: function(e) {
      if (!Object.values(this.$refs).includes(e.relatedTarget)) {
        this.currentCalendar = null;
      }
    }
  },
  data() {
    return {
      currentCalendar: null
    };
  },
	mounted() {
    const component = this;

    this.pikadayStartDate = new Pikaday({
      field: component.$refs.startDate,
      format: displayFormat,
      bound: false,
      container: component.$refs.startCalendar,
      i18n: calendarFormat,
      minDate: new Date(),
      onSelect: function() {
        const date = this.getMoment();
        component.startDate = date.format(inputFormat);
        component.pikadayEndDate.setMinDate(date.toDate());
      }
    });

    this.pikadayEndDate = new Pikaday({
      field: component.$refs.endDate,
      format: displayFormat,
      container: component.$refs.endCalendar,
      i18n: calendarFormat,
      minDate: new Date(),
      bound: false,
      onSelect: function() {
        const date = this.getMoment();
        component.endDate = date.format(inputFormat);
        component.pikadayStartDate.setMaxDate(date.toDate());
      }
    });
	}
}
</script>
