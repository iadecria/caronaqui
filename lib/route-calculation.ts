import type { AddressSuggestion } from '@/hooks/use-address-search'

/**
 * Calcula distância entre dois pontos usando a fórmula de Haversine (em km)
 */
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Interpola pontos intermediários entre origem e destino com suavidade
 */
function interpolateRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  steps: number = 50
): [number, number][] {
  const points: [number, number][] = []

  points.push([origin.lat, origin.lng])

  const latDiff = destination.lat - origin.lat
  const lngDiff = destination.lng - origin.lng

  for (let i = 1; i < steps; i++) {
    const t = i / steps
    const lat = origin.lat + latDiff * t
    const lng = origin.lng + lngDiff * t
    points.push([lat, lng])
  }

  points.push([destination.lat, destination.lng])

  return points
}

/**
 * Calcula pontos intermediários da rota para visualização no mapa
 * @param origin Ponto de origem
 * @param destination Ponto de destino
 * @returns Array de coordenadas [lat, lng]
 */
export function calculateRoutePoints(
  origin: AddressSuggestion | { lat: number; lng: number },
  destination: AddressSuggestion | { lat: number; lng: number }
): [number, number][] {
  return interpolateRoute(
    { lat: origin.lat, lng: origin.lng },
    { lat: destination.lat, lng: destination.lng }
  )
}

/**
 * Calcula a distância aproximada entre dois pontos em km
 */
export function calculateDistance(
  origin: AddressSuggestion | { lat: number; lng: number },
  destination: AddressSuggestion | { lat: number; lng: number }
): number {
  // Safety checks for undefined coordinates
  if (!origin || !destination || typeof origin.lat !== 'number' || typeof origin.lng !== 'number' || typeof destination.lat !== 'number' || typeof destination.lng !== 'number') {
    console.log('[v0] Invalid coordinates for calculateDistance')
    return 0
  }
  
  const distance = haversineDistance(
    origin.lat,
    origin.lng,
    destination.lat,
    destination.lng
  )
  return Math.round(distance * 10) / 10 // Arredonda para 1 casa decimal
}

/**
 * Estima o tempo de viagem
 * Assume velocidade média de 80 km/h em rodovia
 */
export function estimateTravelTime(
  origin: AddressSuggestion | { lat: number; lng: number },
  destination: AddressSuggestion | { lat: number; lng: number }
): string {
  try {
    const distance = calculateDistance(origin, destination)
    
    if (distance === 0) {
      return '0min'
    }
    
    const averageSpeed = 80 // km/h
    const hours = distance / averageSpeed

    const wholeHours = Math.floor(hours)
    const minutes = Math.round((hours - wholeHours) * 60)

    if (wholeHours === 0) {
      return `${minutes}min`
    } else if (minutes === 0) {
      return `${wholeHours}h`
    } else {
      return `${wholeHours}h ${minutes}min`
    }
  } catch (error) {
    console.log('[v0] Error estimating travel time:', error)
    return '0min'
  }
}

/**
 * Retorna informações completas da rota
 */
export function getRouteInfo(
  origin?: AddressSuggestion | { lat: number; lng: number },
  destination?: AddressSuggestion | { lat: number; lng: number }
) {
  // Provide safe defaults if either parameter is missing
  const safeOrigin = origin || { lat: -23.0226, lng: -45.5569 }
  const safeDestination = destination || { lat: -23.1791, lng: -45.8872 }
  
  return {
    distance: calculateDistance(safeOrigin, safeDestination),
    travelTime: estimateTravelTime(safeOrigin, safeDestination),
    points: calculateRoutePoints(safeOrigin, safeDestination)
  }
}
