export function getFilteredEvents(events, filters) {

  // Bail out early if possible. Huge array!
  if (!filters.eventType && !filters.dateRange) {
    return events;
  }

  return events.filter(function(ppEvent) {

    if (filters.eventType && filters.eventType !== ppEvent.event_type) {
      return false;
    }

    // note: there is also a utc timestamp, this is localized
    const localDatetime = moment(ppEvent.start_datetime);
    
    if (filters.dateRange && 
        ((filters.dateRange.start && localDatetime.isBefore(filters.dateRange.start)) ||
        (filters.dateRange.end && localDatetime.isAfter(filters.dateRange.end)))) {
      return false;
    }

    return true;
  });
}
