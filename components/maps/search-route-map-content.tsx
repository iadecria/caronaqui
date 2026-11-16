'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { cn } from '@/lib/utils'
import type { AddressSuggestion } from '@/hooks/use-address-search'

// Ícone customizado para marcadores
const createSearchIcon = (type: 'origin' | 'destination') => {
  const isOrigin = type === 'origin'
  const bgColor = isOrigin ? '#50C878' : '#50C878'
  
  return L.divIcon({
    className: 'search-marker',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: ${bgColor};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(80, 200, 120, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: white;
        font-weight: bold;
      ">
        ${type === 'origin' ? '◉' : '★'}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  })
}

// Componente para ajustar o zoom aos bounds
function FitBounds({ origin, destination }: {
  origin?: AddressSuggestion
  destination?: AddressSuggestion
}) {
  const map = useMap()
  
  useEffect(() => {
    if (!map || !origin || !destination) return
    
    const points: [number, number][] = [
      [origin.lat, origin.lng],
      [destination.lat, destination.lng]
    ]
    
    const bounds = L.latLngBounds(points)
    
    // Aguarda o mapa estar pronto antes de fazer fitBounds
    const timer = setTimeout(() => {
      try {
        if (map && map._container) {
          map.fitBounds(bounds, { padding: [80, 80], duration: 0.5 })
        }
      } catch (error) {
        console.log('[v0] FitBounds error:', error)
      }
    }, 300)
    
    return () => clearTimeout(timer)
  }, [map, origin, destination])
  
  return null
}

interface MapContentProps {
  origin: AddressSuggestion
  destination: AddressSuggestion
  isLoading?: boolean
}

export function MapContent({
  origin,
  destination,
  isLoading = false
}: MapContentProps) {
  // Centro inicial (média entre origem e destino)
  const center: [number, number] = [
    (origin.lat + destination.lat) / 2,
    (origin.lng + destination.lng) / 2
  ]

  return (
    <>
      {/* Loader overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-xs text-muted-foreground">Carregando mapa...</span>
          </div>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={9}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FitBounds origin={origin} destination={destination} />
        
        {/* Marcador de origem */}
        <Marker
          position={[origin.lat, origin.lng]}
          icon={createSearchIcon('origin')}
        >
          <Popup className="custom-popup">
            <div className="p-2">
              <div className="font-semibold text-sm">Saindo de</div>
              <div className="text-xs text-foreground font-medium">{origin.displayName || origin.city}</div>
              {origin.neighborhood && (
                <div className="text-xs text-muted-foreground">{origin.neighborhood}</div>
              )}
            </div>
          </Popup>
        </Marker>
        
        {/* Marcador de destino */}
        <Marker
          position={[destination.lat, destination.lng]}
          icon={createSearchIcon('destination')}
        >
          <Popup className="custom-popup">
            <div className="p-2">
              <div className="font-semibold text-sm">Indo para</div>
              <div className="text-xs text-foreground font-medium">{destination.displayName || destination.city}</div>
              {destination.neighborhood && (
                <div className="text-xs text-muted-foreground">{destination.neighborhood}</div>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </>
  )
}
