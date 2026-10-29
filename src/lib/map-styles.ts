export const MAP_STYLES = ['auto', 'OpenStreetMap', 'Esri.WorldImagery'] as const

export type MapStyle = (typeof MAP_STYLES)[number]

const DEFAULT_PROVIDER = 'OpenStreetMap'
const PHOTO_PROVIDERS = new Set(['Esri.WorldImagery'])

export function resolveMapProvider(style: string) {
  return (MAP_STYLES as readonly string[]).includes(style) && style !== 'auto'
    ? style
    : DEFAULT_PROVIDER
}

export function shouldInvertTiles(provider: string, dark: boolean) {
  return dark && !PHOTO_PROVIDERS.has(provider)
}
