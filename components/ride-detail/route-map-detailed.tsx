'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Ride, RouteStop } from '@/lib/types'
import { cn } from '@/lib/utils'

// Icones customizados para diferentes tipos de marcadores
const createCustomIcon = (type: 'origin' | 'destination' | 'pickup' | 'dropoff', isSelected: boolean = false) => {
  const colors = {
    origin: { bg: '#22c55e', border: '#16a34a' },      // Verde - origem
    destination: { bg: '#22c55e', border: '#16a34a' }, // Verde - destino
    pickup: { bg: '#3b82f6', border: '#2563eb' },      // Azul - embarque
    dropoff: { bg: '#f59e0b', border: '#d97706' }      // Amarelo - desembarque
  }
  
  const color = colors[type]
  const size = type === 'origin' || type === 'destination' ? 16 : 12
  const selectedSize = isSelected ? size + 4 : size
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${selectedSize}px;
        height: ${selectedSize}px;
        background: ${color.bg};
        border: 3px solid ${isSelected ? '#fff' : color.border};
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ${isSelected ? 'transform: scale(1.2);' : ''}
        transition: all 0.2s ease;
      "></div>
    `,
    iconSize: [selectedSize, selectedSize],
    iconAnchor: [selectedSize / 2, selectedSize / 2],
    popupAnchor: [0, -selectedSize / 2]
  })
}

// Icone especial para origem/destino principal
const createMainIcon = (type: 'origin' | 'destination') => {
  const isOrigin = type === 'origin'
  
  return L.divIcon({
    className: 'main-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, ${isOrigin ? '#22c55e' : '#16a34a'} 0%, ${isOrigin ? '#16a34a' : '#15803d'} 100%);
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
          ${isOrigin 
            ? '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" stroke-dasharray="4 2"/>' 
            : '<path d="M12 2L12 14M12 14L7 9M12 14L17 9"/><path d="M5 22h14"/>'}
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  })
}

// Componente para ajustar o zoom do mapa aos bounds
function FitBounds({ stops, originCoords, destinationCoords }: { 
  stops: RouteStop[]
  originCoords?: { lat: number; lng: number }
  destinationCoords?: { lat: number; lng: number }
}) {
  const map = useMap()
  
  useEffect(() => {
    const points: [number, number][] = []
    
    if (originCoords) {
      points.push([originCoords.lat, originCoords.lng])
    }
    if (destinationCoords) {
      points.push([destinationCoords.lat, destinationCoords.lng])
    }
    
    stops.forEach(stop => {
      if (stop.lat && stop.lng) {
        points.push([stop.lat, stop.lng])
      }
    })
    
    if (points.length > 0) {
      const bounds = L.latLngBounds(points)
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [map, stops, originCoords, destinationCoords])
  
  return null
}

// Componente para animar para o marcador selecionado
function FlyToSelected({ selectedStop, stops }: { selectedStop: string | null; stops: RouteStop[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (selectedStop) {
      const stop = stops.find(s => s.id === selectedStop)
      if (stop && stop.lat && stop.lng) {
        map.flyTo([stop.lat, stop.lng], 14, { duration: 0.5 })
      }
    }
  }, [map, selectedStop, stops])
  
  return null
}

interface RouteMapDetailedProps {
  ride: Ride
  selectedStop: string | null
  onStopSelect: (stopId: string | null) => void
}

export function RouteMapDetailed({ ride, selectedStop, onStopSelect }: RouteMapDetailedProps) {
  const stops = ride.stops || []
  const originCoords = ride.originCoords
  const destinationCoords = ride.destinationCoords
  
  // Calcula o centro inicial do mapa
  const center: [number, number] = originCoords 
    ? [originCoords.lat, originCoords.lng]
    : [-23.1, -45.7] // Fallback para regiao Vale do Paraiba
  
  // Cria array de pontos para a linha da rota
  const routePoints: [number, number][] = []
  
  if (originCoords) {
    routePoints.push([originCoords.lat, originCoords.lng])
  }
  
  stops.forEach(stop => {
    if (stop.lat && stop.lng) {
      routePoints.push([stop.lat, stop.lng])
    }
  })
  
  if (destinationCoords && !stops.find(s => s.lat === destinationCoords.lat && s.lng === destinationCoords.lng)) {
    routePoints.push([destinationCoords.lat, destinationCoords.lng])
  }

  return (
    <MapContainer
      center={center}
      zoom={10}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <FitBounds 
        stops={stops} 
        originCoords={originCoords} 
        destinationCoords={destinationCoords}
      />
      
      <FlyToSelected selectedStop={selectedStop} stops={stops} />
      
      {/* Linha da rota */}
      {routePoints.length > 1 && (
        <Polyline
          positions={routePoints}
          pathOptions={{
            color: '#22c55e',
            weight: 4,
            opacity: 0.8,
            dashArray: '10, 10'
          }}
        />
      )}
      
      {/* Marcador de origem principal */}
      {originCoords && (
        <Marker
          position={[originCoords.lat, originCoords.lng]}
          icon={createMainIcon('origin')}
        >
          <Popup className="custom-popup">
            <div className="p-1">
              <div className="font-semibold text-sm">Partida</div>
              <div className="text-xs text-gray-600">{ride.origin.meetingPoint}</div>
              <div className="text-xs text-gray-500">{ride.origin.neighborhood}, {ride.origin.city}</div>
              <div className="text-xs font-medium text-green-600 mt-1">{ride.time}</div>
            </div>
          </Popup>
        </Marker>
      )}
      
      {/* Marcadores das paradas intermediarias */}
      {stops.map((stop) => {
        const isSelected = selectedStop === stop.id
        const isFirstOrLast = stops.indexOf(stop) === 0 || stops.indexOf(stop) === stops.length - 1
        
        // Pula primeira e ultima parada se coincidem com origem/destino
        if (isFirstOrLast && originCoords && destinationCoords) {
          const isOrigin = stop.lat === originCoords.lat && stop.lng === originCoords.lng
          const isDest = stop.lat === destinationCoords.lat && stop.lng === destinationCoords.lng
          if (isOrigin || isDest) return null
        }
        
        return (
          <Marker
            key={stop.id}
            position={[stop.lat, stop.lng]}
            icon={createCustomIcon(stop.type, isSelected)}
            eventHandlers={{
              click: () => onStopSelect(stop.id)
            }}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <div className="flex items-center gap-1 mb-1">
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-medium",
                    stop.type === 'pickup' 
                      ? "bg-blue-100 text-blue-700" 
                      : "bg-amber-100 text-amber-700"
                  )}>
                    {stop.type === 'pickup' ? 'Embarque' : 'Desembarque'}
                  </span>
                  <span className="text-xs font-medium text-green-600">{stop.time}</span>
                </div>
                <div className="font-semibold text-sm">{stop.address}</div>
                <div className="text-xs text-gray-500">{stop.neighborhood}, {stop.city}</div>
                {stop.passenger && (
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-100">
                    <img 
                      src={stop.passenger.avatar} 
                      alt={stop.passenger.name}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-xs">{stop.passenger.name}</span>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )
      })}
      
      {/* Marcador de destino principal */}
      {destinationCoords && (
        <Marker
          position={[destinationCoords.lat, destinationCoords.lng]}
          icon={createMainIcon('destination')}
        >
          <Popup className="custom-popup">
            <div className="p-1">
              <div className="font-semibold text-sm">Destino Final</div>
              <div className="text-xs text-gray-600">{ride.destination.dropOffPoint}</div>
              <div className="text-xs text-gray-500">{ride.destination.neighborhood}, {ride.destination.city}</div>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}
