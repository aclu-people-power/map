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
import { setHash } from 'src/util/url-hash';
import moment from 'moment';
import Pikaday from 'pikaday';

// e.g., 2017-03-01
const inputFormat = 'YYYY-MM-DD';
// e.g., Mar 1, 2017
const displayFormat = 'MMM D, YYYY';

// Pikaday needs all of these i18n values just to override the weekdays to
// be single letters.  Everything is default except `weekdaysShort`
const calendarFormat = {
  previousMonth: 'Previous Month',
  nextMonth: 'Next Month',
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  weekdays: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  weekdaysShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
}

export default {
  name: 'event-type-filters',
  props: ['filters', 'showTitle'],
  data() {
    const startDate = this.filters.startDate ?
      moment(this.filters.startDate, inputFormat).format(displayFormat)
      : null;

    const endDate = this.filters.endDate ?
      moment(this.filters.endDate, inputFormat).format(displayFormat)
      : null;

    return {
      startDate,
      endDate,
      currentCalendar: 'startDate'
    };
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
        component.startDate = date.format(displayFormat);
        setHash({ startDate: date.format(inputFormat) });
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
        component.endDate = date.format(displayFormat);
        setHash({ endDate: date.format(inputFormat) });
        component.pikadayStartDate.setMaxDate(date.toDate());
      }
    });

    // Focus the startDate field by default
    this.$refs.startDate.focus();
	}
}
</script>
