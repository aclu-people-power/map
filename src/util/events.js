import moment from 'moment';
// FIXME swap in an xhr call when we can.
import loadScript from 'load-script';

export function loadEvents(cb = () => {}) {
  const script = document.getElementById('events-data');

  // Remove old script tag so we don't have like a million billion
  // of these in the DOM
  if (script && script.parentNode) {
    script.parentNode.removeChild(script);
  }

  loadScript(
    'https://s3.amazonaws.com/thirdbear-backups/aclu/public/action_events.js',
    { attrs: { id: 'events-data' } },
    cb
  )
}

export function pollForNewEvents(interval, cb = () => {}) {
  setInterval(() => {
    loadEvents(cb)
  }, interval);
}

const metersToMiles = (meters) => meters * 0.00062137;

export function getFilteredEvents(events, filters, zipcodes) {
  // Bail out early if possible. Huge array!
  if (!filters.eventType && !filters.startDate && !filters.endDate && !filters.zipcode) {
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

    if (filters.zipcode) {
      // We do not yet have valid zipcodes to filter against,
      // give it a pass.
      if (!Object.keys(filters.zipcode).length) {
        return true;
      }

      const zipcodeLatLng = L.latLng(zipcodes[filters.zipcode]);

      const milesFromZipcode = metersToMiles(
         zipcodeLatLng.distanceTo([event.lat, event.lng])
      );

      const MAX_MILES_FROM_ZIPCODE = 50;

      if (milesFromZipcode > MAX_MILES_FROM_ZIPCODE) {
        return false;
      }
    }

    return true;
  });
}
