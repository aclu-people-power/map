import moment from 'moment';

export function getFilteredEvents(events, filters) {

  // Bail out early if possible. Huge array!
  if (!filters.eventType && !filters.startDate && !filters.endDate) {
    return events;
  }

  return events.filter(function(event) {

    // should maybe be using event.categories, not sure
    if (filters.eventType && filters.eventType !== event.event_type) {
      return false;
    }

    // note: there is also a utc timestamp, this one is localized
    const localDatetime = moment(event.start_datetime);

    if (filters.startDate) {
      const startDate = moment(filters.startDate, 'YYYY-MM-DD');

      if (localDatetime.isBefore(startDate)) {
        return false;
      }
    }

    if (filters.endDate) {
      const endDate = moment(filters.endDate, 'YYYY-MM-DD');
    
      if (localDatetime.isAfter(endDate)) {
        return false;
      }
    }

    return true;
  });
}
