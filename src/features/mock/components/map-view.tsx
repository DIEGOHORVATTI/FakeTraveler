import { useEffect, useMemo, useRef, useState } from 'react'
import { useColorScheme, View } from 'react-native'
import { WebView, type WebViewMessageEvent } from 'react-native-webview'

import type { Coordinates } from '@/modules/mock-location'
import { resolveMapProvider, shouldInvertTiles } from '@/src/lib/map-styles'
import { useSettings } from '@/src/stores/settings-store'

import { buildLeafletHtml, MAP_BASE_URL } from '../utils/leaflet-html'
import { MapSkeleton } from './map-skeleton'

type MapMessage =
  | ({ type: 'pick' } & Coordinates)
  | { type: 'zoom'; zoom: number }
  | { type: 'ready' }

type MapViewProps = {
  marker: Coordinates
  onPick: (position: Coordinates) => void
  onZoom: (zoom: number) => void
}

export function MapView({ marker, onPick, onZoom }: MapViewProps) {
  const webView = useRef<WebView>(null)
  const [readyHtml, setReadyHtml] = useState<string | null>(null)
  const mapStyle = useSettings((state) => state.mapProvider)
  const zoom = useSettings((state) => state.zoom)
  const route = useSettings((state) => state.route)
  const dark = useColorScheme() !== 'light'
  const provider = resolveMapProvider(mapStyle)

  const html = useMemo(() => {
    const { latitude, longitude, zoom: initialZoom } = useSettings.getState()
    return buildLeafletHtml({
      latitude,
      longitude,
      zoom: initialZoom,
      provider,
      dark,
      invertTiles: shouldInvertTiles(provider, dark),
    })
  }, [provider, dark])

  const moveMarkerScript = `window.setOnMap && window.setOnMap(${marker.latitude}, ${marker.longitude}, ${zoom}); true;`
  const routeScript = `window.setRoute && window.setRoute(${JSON.stringify(route?.points ?? [])}); true;`

  useEffect(() => {
    webView.current?.injectJavaScript(moveMarkerScript)
  }, [moveMarkerScript])

  useEffect(() => {
    webView.current?.injectJavaScript(routeScript)
  }, [routeScript])

  function syncMap() {
    webView.current?.injectJavaScript(moveMarkerScript + routeScript)
  }

  function handleMessage(event: WebViewMessageEvent) {
    const message = JSON.parse(event.nativeEvent.data) as MapMessage
    if (message.type === 'ready') return setReadyHtml(html)
    if (message.type === 'zoom') return onZoom(message.zoom)
    onPick({ latitude: message.latitude, longitude: message.longitude })
  }

  return (
    <View className="flex-1">
      <WebView
        ref={webView}
        className="flex-1"
        originWhitelist={['*']}
        source={{ html, baseUrl: MAP_BASE_URL }}
        onMessage={handleMessage}
        onLoadEnd={syncMap}
      />
      {readyHtml === html ? null : <MapSkeleton />}
    </View>
  )
}
