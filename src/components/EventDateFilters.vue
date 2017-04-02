<template>
  <div>
    <h5 v-if="showTitle" class="filter-events-title">Date of event</h5>
    <div class="filter-events-date-picker">
      <input ref="startDate" type="text" :value="startDate" />
      <strong>to</strong>
      <input ref="endDate" type="text" :value="endDate" />
    </div>
  </div>
</template>

<script>
import moment from 'moment';

// sigh
window.moment = moment;

import Pikaday from 'pikaday';

// e.g., 2017-03-01
const inputFormat = 'YYYY-MM-DD';
// e.g., Mar 1, 2017
const displayFormat = 'MMM D, YYYY'
const forDisplay = (date) => {
  if(date){
    return moment(date, inputFormat).format(displayFormat);
  }else{
    return null
  }
}

export default {
  name: 'event-type-filters',
  props: ['filters', 'showTitle'],
  computed: {
    startDate: {
      get(){
        return forDisplay(store.state.filters.startDate);
      },
      set(value){
        store.commit('setFilters',{startDate: value})
      }
    },
    endDate: {
      get(){
        return forDisplay(store.state.filters.endDate);
      },
      set(value){
        store.commit('setFilters',{endDate: value})
      }
    }
  },
	mounted() {
    const component = this;

    this.pikadayStartDate = new Pikaday({
      field: this.$refs.startDate,
      format: displayFormat,
      position: 'bottom',
      minDate: new Date(),
      onSelect: function() {
        const date = this.getMoment();
        component.startDate = date.format(inputFormat);
        component.pikadayEndDate.setMinDate(date.toDate());
      }
    });

    this.pikadayEndDate = new Pikaday({
      field: this.$refs.endDate,
      format: displayFormat,
      position: 'bottom',
      minDate: new Date(),
      onSelect: function() {
        const date = this.getMoment();
        component.endDate = date.format(inputFormat);
        component.pikadayStartDate.setMaxDate(date.toDate());
      }
    });
	}
}
</script>
