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
import { setHash } from 'src/util/url-hash';
import moment from 'moment';

// sigh
window.moment = moment;

import Pikaday from 'pikaday';

// e.g., 2017-03-01
const inputFormat = 'YYYY-MM-DD';
// e.g., Mar 1, 2017
const displayFormat = 'MMM D, YYYY'

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
      endDate
    };
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
        component.startDate = date.format(displayFormat);
        setHash({ startDate: date.format(inputFormat)  });

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
        component.endDate = date.format(displayFormat);
        setHash({ endDate: date.format(inputFormat)  });
			}
    });
	}
}
</script>
