export const MAP_STYLES = [
  'auto',
  'CartoDB.Voyager',
  'CartoDB.Positron',
  'CartoDB.DarkMatter',
  'OpenStreetMap',
  'OpenTopoMap',
  'Esri.WorldImagery',
] as const

export type MapStyle = (typeof MAP_STYLES)[number]

export function resolveMapProvider(style: string, dark: boolean) {
  if (style !== 'auto') return style
  return dark ? 'CartoDB.DarkMatter' : 'CartoDB.Voyager'
}
