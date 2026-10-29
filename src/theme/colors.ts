import { useColorScheme } from 'react-native'

const palette = {
  dark: { background: '#0d0d0d', text: '#ffffff', muted: '#6b7280', accent: '#22c55e' },
  light: { background: '#f5f5f7', text: '#111114', muted: '#8a8f98', accent: '#15803d' },
}

export function useThemeColors() {
  return palette[useColorScheme() === 'light' ? 'light' : 'dark']
}
