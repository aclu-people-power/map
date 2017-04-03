import moment from 'moment';
import distance from 'turf-distance';

const metersToMiles = (meters) => meters * 0.00062137;

export function getFilteredEvents(events, filters, zipcodes) {
  // Bail out early if possible. Huge array!
  if (!filters.eventType && !filters.startDate && !filters.endDate && !filters.zipcode) {
    return events;
  }

  const zipCodesLength = (Object.keys(zipcodes) || []).length;

  return events.filter(function(event) {

    if (filters.eventType) {
      if (!event.categories) {
        return false;
      }

      const allCategories = event.categories.split(',');
      const allEventTypes = filters.eventType.split(',');

      const eventIsInNoSelectedCategories = allEventTypes.every(type =>
        !allCategories.includes(type)
      );

      if (eventIsInNoSelectedCategories) {
        return false;
      }
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
      if (!zipcodes || !zipCodesLength) {
        return true;
      }

      const milesFromZipcode = metersToMiles(
        distance(zipcodes[filters.zipcode].reverse(), [event.lng, event.lat])
      );

      const MAX_MILES_FROM_ZIPCODE = 50;

      if (milesFromZipcode > MAX_MILES_FROM_ZIPCODE) {
        return false;
      }
    }

    return true;
  });
}

export const eventTypes = {
  freedomcities: "Freedom Cities Action",
  muslimban: "Muslim Ban Action",
  protestrally: "Protest/Rally",
  townmeeting: "Town Meeting",
  organizing: "Organizing Meeting",
  healthcareaction: "Health Care Action",
  other: "Other"
};
