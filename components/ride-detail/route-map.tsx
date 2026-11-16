'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

L.Marker.prototype.setIcon(defaultIcon)

interface RouteMapProps {
  from: { name: string; lat: number; lng: number }
  to: { name: string; lat: number; lng: number }
}

// Componente para ajustar o zoom automaticamente aos bounds
function FitBoundsCom({ from, to }: { from: RouteMapProps['from']; to: RouteMapProps['to'] }) {
  const map = useMap()
  
  useEffect(() => {
    if (!map) return
    
    const points: [number, number][] = [
      [from.lat, from.lng],
      [to.lat, to.lng]
    ]
    
    const bounds = L.latLngBounds(points)
    
    // Aguarda o mapa estar totalmente pronto antes de fazer fitBounds
    const timer = setTimeout(() => {
      try {
        if (map && map._container) {
          map.fitBounds(bounds, { padding: [50, 50], duration: 0.5 })
        }
      } catch (error) {
        console.log('[v0] FitBounds error:', error)
      }
    }, 300)
    
    return () => clearTimeout(timer)
  }, [map, from, to])
  
  return null
}

export function RouteMap({ from, to }: RouteMapProps) {
  // Center inicial (será sobrescrito pelo FitBounds)
  const center: [number, number] = [
    (from.lat + to.lat) / 2,
    (from.lng + to.lng) / 2
  ]

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden border border-border shadow-sm">
      <MapContainer
        center={center}
        zoom={9}
        scrollWheelZoom={false}
        dragging={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FitBoundsCom from={from} to={to} />
        
        <Marker position={[from.lat, from.lng]} icon={defaultIcon}>
          <Popup className="text-sm">
            <div className="font-semibold">{from.name}</div>
            <div className="text-xs text-muted-foreground">Saída</div>
          </Popup>
        </Marker>
        <Marker position={[to.lat, to.lng]} icon={defaultIcon}>
          <Popup className="text-sm">
            <div className="font-semibold">{to.name}</div>
            <div className="text-xs text-muted-foreground">Destino</div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
