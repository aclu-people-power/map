;(function() {

  /**
   * Utilities 
   */

  function getFilteredEvents(events, filters) {

    // Bail out early if possible. Huge array!
    if (!filters.eventType && !filters.dateRange) {
      return events;
    }

    return events.filter(function(ppEvent) {

      if (filters.eventType && filters.eventType !== ppEvent.event_type) {
        return false;
      }

      // note: there is also a utc timestamp, this is localized
      var localDatetime = moment(ppEvent.start_datetime);
      
      if (filters.dateRange && 
          ((filters.dateRange.start && localDatetime.isBefore(filters.dateRange.start)) ||
          (filters.dateRange.end && localDatetime.isAfter(filters.dateRange.end)))) {
        return false;
      }

      return true;
    });
  }

  function plotEvents(events, map) {
    var overlays = L.layerGroup().addTo(map);

    events.forEach(function(ppEvent) {
      L.circleMarker([ppEvent.lat, ppEvent.lng], {
        radius: 5, 
        color: 'white', 
        fillColor: '#ef3030', 
        opacity: 0.8, 
        fillOpacity: 0.7, 
        weight: 2 
      }).addTo(overlays);
    }); 

    return overlays;
  }

  function setMapPositionBasedOnZip(zipcode, knownZipcodes, events, map) {
    if (!zipcode || !knownZipcodes[zipcode]) {
      return;
    }

    var coords = knownZipcodes[zipcode];
    map.setView([coords.lat, coords.lng], 9);
  }

  /**
   * DO STUFF 
   */

  // (the url will be the source of truth for these values. here
  //  we are just faking it)
  var filters = {
    eventType: null,
    dateRange: null,
    zipcode: '53211', 
  };

  // first we compute the filtered event set
  var filteredEvents = getFilteredEvents(window.PEOPLEPOWER_EVENTS, filters);

  // then plot those events
  plotEvents(filteredEvents, window.map);

  // then adjust map position accordingly
  setMapPositionBasedOnZip(
    filters.zipcode, 
    window.KNOWN_ZIPCODES, 
    filteredEvents,
    window.map
  );

}())
