import { expect, it } from 'bun:test'
import { strToU8, zipSync } from 'fflate'

import { parseRouteFile, routeDistanceKm } from './route-file'

const gpx = `<?xml version="1.0"?>
<gpx><wpt lat="1" lon="1"/><trk><trkseg>
  <trkpt lon="-46.6" lat="-23.5"><ele>760</ele></trkpt>
  <trkpt lat='-23.6' lon='-46.7'/>
</trkseg></trk></gpx>`

const kml = `<kml><Placemark><LineString><coordinates>
  -46.6,-23.5,0 -46.7,-23.6,0
</coordinates></LineString></Placemark></kml>`

it('lê trilha GPX em qualquer ordem de atributo e prefere trkpt', () => {
  expect(parseRouteFile('trilha.gpx', strToU8(gpx))).toEqual([
    [-23.5, -46.6],
    [-23.6, -46.7],
  ])
})

it('lê KML invertendo lng,lat', () => {
  expect(parseRouteFile('rota.kml', strToU8(kml))).toEqual([
    [-23.5, -46.6],
    [-23.6, -46.7],
  ])
})

it('abre o KML de dentro de um KMZ', () => {
  const kmz = zipSync({ 'doc.kml': strToU8(kml) })
  expect(parseRouteFile('rota.kmz', kmz)).toHaveLength(2)
})

it('mede a distância da rota', () => {
  expect(
    routeDistanceKm([
      [0, 0],
      [0, 1],
    ]),
  ).toBeCloseTo(111.19, 1)
})
