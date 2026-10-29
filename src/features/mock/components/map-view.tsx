import { useEffect, useMemo, useRef } from 'react'
import { useColorScheme } from 'react-native'
import { WebView, type WebViewMessageEvent } from 'react-native-webview'

import type { Coordinates } from '@/modules/mock-location'
import { useSettings } from '@/src/stores/settings-store'

import { buildLeafletHtml, MAP_BASE_URL } from '../utils/leaflet-html'

type MapMessage = ({ type: 'pick' } & Coordinates) | { type: 'zoom'; zoom: number }

type MapViewProps = {
  marker: Coordinates
  onPick: (position: Coordinates) => void
  onZoom: (zoom: number) => void
}

export function MapView({ marker, onPick, onZoom }: MapViewProps) {
  const webView = useRef<WebView>(null)
  const provider = useSettings((state) => state.mapProvider)
  const zoom = useSettings((state) => state.zoom)
  const dark = useColorScheme() !== 'light'

  const html = useMemo(() => {
    const { latitude, longitude, zoom } = useSettings.getState()
    return buildLeafletHtml({ latitude, longitude, zoom, provider, dark })
  }, [provider, dark])

  const moveMarkerScript = `window.setOnMap && window.setOnMap(${marker.latitude}, ${marker.longitude}, ${zoom}); true;`

  function moveMarker() {
    webView.current?.injectJavaScript(moveMarkerScript)
  }

  useEffect(() => {
    webView.current?.injectJavaScript(moveMarkerScript)
  }, [moveMarkerScript])

  function handleMessage(event: WebViewMessageEvent) {
    const message = JSON.parse(event.nativeEvent.data) as MapMessage
    if (message.type === 'zoom') return onZoom(message.zoom)
    onPick({ latitude: message.latitude, longitude: message.longitude })
  }

  return (
    <WebView
      ref={webView}
      className="flex-1"
      originWhitelist={['*']}
      source={{ html, baseUrl: MAP_BASE_URL }}
      onMessage={handleMessage}
      onLoadEnd={moveMarker}
    />
  )
}
