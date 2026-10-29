export function parseNumber(text: string): number | null {
  const normalized = text.trim().replace(',', '.')
  if (!normalized) return null

  const value = Number(normalized)
  return Number.isFinite(value) ? value : null
}

export function parseCoordinate(text: string, limit: number): number | null {
  const value = parseNumber(text)
  return value !== null && Math.abs(value) <= limit ? value : null
}

export function formatCoordinate(value: number) {
  return String(Number(value.toFixed(6)))
}
