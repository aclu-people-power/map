export function plotEvents(events, map) {
  const overlays = L.layerGroup().addTo(map);

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

export function setMapPositionBasedOnZip(zipcode, knownZipcodes, events, map) {
  if (!zipcode || !knownZipcodes[zipcode]) {
    return;
  }

  const latLng = knownZipcodes[zipcode];
  const zoom = 9;

  map.setView(latLng, zoom);
}
