;(function() {

  L.mapbox.accessToken = "pk.eyJ1Ijoia2VubmV0aHBlbm5pbmd0b24iLCJhIjoiY2l6bmJ3MmFiMDMzZTMzbDJtdGxkM3hveSJ9.w4iOGaL2vrIvETimSXUXsw";

  var centerOfUS = [37.8, -96.9];

  var map = window.map = L.mapbox.map('map', 'mapbox.streets')
    .setView(centerOfUS, 4);

}())
