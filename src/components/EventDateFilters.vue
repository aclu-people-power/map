<template>
  <div class='event-date-filters'>
    <h5 v-if="showTitle" class="filter-events-title">Date of event</h5>
    <div class="filter-events-date-picker">
      <div class='date-picker-header'>
        <input
          autofocus
          v-on:click="currentCalendar = 'startDate'"
          ref="startDate"
          type="text"
          :value="startDate"
        />
        <strong>to</strong>
        <input
          v-on:click="currentCalendar = 'endDate'"
          ref="endDate"
          type="text"
          :value="endDate"
        />
      </div>
      <div id='calendar-container'>
        <div v-show="currentCalendar === 'startDate'" id='start-calendar' />
        <div v-show="currentCalendar === 'endDate'" id='end-calendar' />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import Pikaday from 'pikaday';

// sigh
window.moment = moment;

// e.g., 2017-03-01
const inputFormat = 'YYYY-MM-DD';
// e.g., Mar 1, 2017
const displayFormat = 'MMM D, YYYY'
const forDisplay = (date) => {
  if(date){
    return moment(date, inputFormat).format(displayFormat);
  } else {
  return null
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
  data: () => {
    return { currentCalendar: 'startDate' };
  },
  computed: {
    startDate: {
      get(){
        return forDisplay(this.$store.state.filters.startDate);
      },
      set(value){
        this.$store.commit('setFilters',{ startDate: value })
      }
    },
    endDate: {
      get(){
        return forDisplay(this.$store.state.filters.endDate);
      },
      set(value){
        this.$store.commit('setFilters',{ endDate: value })
      }
    }
  },
	mounted() {
    const component = this;

    this.pikadayStartDate = new Pikaday({
      field: component.$refs.startDate,
      format: displayFormat,
      bound: false,
      container: document.getElementById('start-calendar'),
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
      container: document.getElementById('end-calendar'),
      i18n: calendarFormat,
      minDate: new Date(),
      bound: false,
      onSelect: function() {
        const date = this.getMoment();
        component.endDate = date.format(inputFormat);
        component.pikadayStartDate.setMaxDate(date.toDate());
      }
    });

    // Focus the startDate field by default
    this.$refs.startDate.focus();
	}
}
</script>
