import moment from 'moment';
import distance from 'turf-distance';
import inside from 'turf-inside';
import { polygon, point } from '@turf/helpers'

export function computeFilteredEvents(events, map, filters, zipcodes) {

  if (filters && filters.zipcode) {
    const zipcodesLength = Object.keys(zipcodes || {}).length;
    const validZipcode = zipcodesLength && !!zipcodes[filters.zipcode];

    // A zipcode is selected but either we do not yet have valid zipcodes
    // to check it against and get its coords, or the zipcode is invalid;
    // either way there can be no valid events. Bail early.
    if (!zipcodesLength || !validZipcode) {
      console.log('nope nope nope', zipcodesLength, validZipcode)
      return [];
    }
  }

  let poly = null;
  if (map) {
    poly = polygon([[
      [map[0][0], map[0][1]],
      [map[0][0], map[1][1]],
      [map[1][0], map[1][1]],
      [map[1][0], map[0][1]],
      [map[0][0], map[0][1]]
    ]])
  }
  
  const filteredEvents = events.filter(event => {

    if (filters.eventType) {
      const eventCategories = event.categories ?
        event.categories.split(',') :
        [];

      // The UI lumps into "event types" what are mostly "categories"
      // in ActionKit, with this one exception, the is_official
      // boolean field, so we will just pretend it is a category.
      if (event.is_official) {
        eventCategories.push('aclu');
      }

      if (!eventCategories.length) {
        return false;
      }

      const selectedEventTypes = filters.eventType.split(',');

      const eventMatchesNoSelectedTypes = selectedEventTypes.every(
        type => !eventCategories.includes(type)
      );

      if (eventMatchesNoSelectedTypes) {
        return false;
      }
    }

    // note: there is also a utc timestamp, this one is localized
    const localDatetime = moment(event.start_datetime);

    if (filters.startDate) {
      const startDate = moment(filters.startDate, 'YYYY-MM-DD');

      if (localDatetime.isBefore(startDate, 'day')) {
        return false;
      }
    }

    if (filters.endDate) {
      const endDate = moment(filters.endDate, 'YYYY-MM-DD');

      if (localDatetime.isAfter(endDate, 'day')) {
        return false;
      }
    }

    if (map) {
      if (!inside(point([event.lng, event.lat]), poly)) {
        return false;
      }
    }
    
    return true;
  });

  // When a zipcode is selected, list events soonest first (by day only; ignoring time)
  // and for events on the same day, secondarily sort by proximity to that zipcode.
  if (filters.zipcode) {

    filteredEvents.sort((a, b) => {
      const startTimeA = moment(a.starts_at_utc).startOf("day").valueOf();
      const startTimeB = moment(b.starts_at_utc).startOf("day").valueOf();

      if (startTimeA !== startTimeB) {
        return startTimeA - startTimeB;
      }

      const distanceFromA = distance(zipcodes[filters.zipcode], [a.lng, a.lat]);
      const distanceFromB = distance(zipcodes[filters.zipcode], [b.lng, b.lat]);

      return distanceFromA - distanceFromB;
    });

  }

  return filteredEvents;
}
