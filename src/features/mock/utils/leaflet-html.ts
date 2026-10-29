const LEAFLET = 'https://unpkg.com/leaflet@1.9.4/dist'
const LEAFLET_PROVIDERS = 'https://unpkg.com/leaflet-providers@2.0.0/leaflet-providers.js'

const PIN_COLOR = '#16a34a'

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
  .leaflet-container { background: ${options.dark ? '#0d0d0d' : '#f5f5f7'}; }
  .leaflet-control-attribution { font-size: 9px; opacity: 0.7; }
  .pin { filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.35)); }
</style>
</head>
<body>
<div id="map"></div>
<script>
  const options = ${toScriptLiteral(options)};
  const post = (message) => window.ReactNativeWebView.postMessage(JSON.stringify(message));
  const map = L.map('map', { zoomControl: false }).setView([options.latitude, options.longitude], options.zoom);
  const tileOptions = { referrerPolicy: 'strict-origin-when-cross-origin' };
  let tiles;
  try {
    tiles = L.tileLayer.provider(options.provider, tileOptions);
  } catch (error) {
    tiles = L.tileLayer.provider('OpenStreetMap', tileOptions);
  }
  tiles.addTo(map);
  const icon = L.divIcon({
    className: 'pin',
    html: '<svg width="36" height="48" viewBox="0 0 36 48"><path d="M18 0C8 0 0 8 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8 28 0 18 0z" fill="${PIN_COLOR}"/><circle cx="18" cy="18" r="7" fill="#fff"/></svg>',
    iconSize: [36, 48],
    iconAnchor: [18, 48],
  });
  const marker = L.marker([options.latitude, options.longitude], { icon }).addTo(map);

  const pick = (event) => {
    const position = event.latlng.wrap();
    marker.setLatLng(position);
    post({ type: 'pick', latitude: position.lat, longitude: position.lng });
  };
  map.on('click', pick);
  map.on('contextmenu', pick);
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
