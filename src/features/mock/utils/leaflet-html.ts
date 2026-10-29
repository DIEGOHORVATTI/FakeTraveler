const LEAFLET = 'https://unpkg.com/leaflet@1.9.4/dist'
const LEAFLET_PROVIDERS = 'https://unpkg.com/leaflet-providers@2.0.0/leaflet-providers.js'

export const MAP_BASE_URL = 'https://github.com/DIEGOHORVATTI/FakeTraveler'

type LeafletHtmlOptions = {
  latitude: number
  longitude: number
  zoom: number
  provider: string
  dark: boolean
}

function toScriptLiteral(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

export function buildLeafletHtml(options: LeafletHtmlOptions) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<link rel="stylesheet" href="${LEAFLET}/leaflet.css" />
<script src="${LEAFLET}/leaflet.js"></script>
<script src="${LEAFLET_PROVIDERS}"></script>
<style>
  html, body, #map { height: 100%; margin: 0; }
  body.dark .map-tiles, body.dark .leaflet-control-zoom a {
    filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
  }
  body.dark .leaflet-container { background: #000; }
</style>
</head>
<body class="${options.dark ? 'dark' : ''}">
<div id="map"></div>
<script>
  const options = ${toScriptLiteral(options)};
  const post = (message) => window.ReactNativeWebView.postMessage(JSON.stringify(message));
  const map = L.map('map').setView([options.latitude, options.longitude], options.zoom);
  const tileOptions = { className: 'map-tiles', referrerPolicy: 'strict-origin-when-cross-origin' };
  let tiles;
  try {
    tiles = L.tileLayer.provider(options.provider, tileOptions);
  } catch (error) {
    tiles = L.tileLayer.provider('OpenStreetMap', tileOptions);
  }
  tiles.addTo(map);
  const marker = L.marker([options.latitude, options.longitude]).addTo(map);

  map.on('contextmenu', (event) => {
    const position = event.latlng.wrap();
    marker.setLatLng(position);
    post({ type: 'pick', latitude: position.lat, longitude: position.lng });
  });
  map.on('zoomend', () => post({ type: 'zoom', zoom: map.getZoom() }));

  window.setOnMap = (latitude, longitude, zoom) => {
    if (marker.getLatLng().equals([latitude, longitude]) && map.getZoom() === zoom) return;
    marker.setLatLng([latitude, longitude]);
    map.setView([latitude, longitude], zoom);
  };
</script>
</body>
</html>`
}
