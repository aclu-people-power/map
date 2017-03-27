export function plotEvents(events, map) {
  const layer = L.layerGroup().addTo(map);

  events.forEach(function(event) {
    L.circleMarker([event.lat, event.lng], {
      radius: 5,
      color: 'white',
      fillColor: '#ef3030',
      opacity: 0.8,
      fillOpacity: 0.7,
      weight: 2
    }).addTo(layer);
  });

  return layer;
}

export function setMapPositionBasedOnZip(zipcode, knownZipcodes, events, map) {
  if (!zipcode || !knownZipcodes[zipcode]) {
    return;
  }

  const latLng = knownZipcodes[zipcode];
  const zoom = 9;

  map.setView(latLng, zoom);
}
