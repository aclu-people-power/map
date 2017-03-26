// This makes window.L (leaflet.js) available. mapbox.js
// is a leaflet plugin.
import 'mapbox.js';

L.mapbox.accessToken = "pk.eyJ1Ijoia2VubmV0aHBlbm5pbmd0b24iLCJhIjoiY2l6bmJ3MmFiMDMzZTMzbDJtdGxkM3hveSJ9.w4iOGaL2vrIvETimSXUXsw";

const centerOfUS = [37.8, -96.9];
const zoom = 4;

window.map = L.mapbox.map('map', 'mapbox.streets')
  .setView(centerOfUS, zoom);
