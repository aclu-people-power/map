import '../css/index.scss';

import { getFilteredEvents } from './event-utils';
import { plotEvents, setMapPositionBasedOnZip } from './map-utils';


// Boot:

// (the url will be the source of truth for these values. here
//  we are just faking it)
const filters = {
  eventType: null,
  dateRange: null,
  zipcode: '53211', 
};

// first we compute the filtered event set
const filteredEvents = getFilteredEvents(window.PEOPLEPOWER_EVENTS, filters);

// then plot those events
plotEvents(filteredEvents, window.map);

// then adjust map position accordingly
setMapPositionBasedOnZip(
  filters.zipcode, 
  window.KNOWN_ZIPCODES, 
  filteredEvents,
  window.map
);
