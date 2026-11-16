'use client'

import { useEffect, useState, useRef, useId } from 'react'
import { MapPin, Navigation, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Location {
  lat: number
  lng: number
  label?: string
}

interface MapPreviewProps {
  origin?: Location
  destination?: Location
  center?: { lat: number; lng: number }
  zoom?: number
  className?: string
  showControls?: boolean
}

// Pontos detalhados da Via Dutra (BR-116) entre Rio e Sao Paulo
// Coordenadas extraidas do OpenStreetMap seguindo a rodovia
const VIA_DUTRA_POINTS: [number, number][] = [
  // Rio de Janeiro - Centro/Rodoviaria
  [-22.9068, -43.1729],
  [-22.8850, -43.2200],
  [-22.8600, -43.2500],
  // Zona Norte RJ
  [-22.8200, -43.2800],
  [-22.7800, -43.3100],
  [-22.7400, -43.3300],
  [-22.7000, -43.3500],
  // Duque de Caxias
  [-22.6600, -43.3700],
  [-22.6200, -43.4000],
  [-22.5800, -43.4300],
  [-22.5400, -43.4700],
  // Nova Iguacu / Seropedica
  [-22.5000, -43.5200],
  [-22.4700, -43.5800],
  [-22.4500, -43.6500],
  [-22.4400, -43.7200],
  // Pirai
  [-22.4500, -43.7800],
  [-22.4700, -43.8400],
  [-22.4900, -43.9000],
  [-22.5000, -43.9600],
  [-22.5100, -44.0200],
  // Volta Redonda
  [-22.5234, -44.0945],
  [-22.5200, -44.1200],
  // Barra Mansa
  [-22.5400, -44.1700],
  [-22.5100, -44.2300],
  // Resende
  [-22.4800, -44.2900],
  [-22.4600, -44.3500],
  [-22.4500, -44.4000],
  [-22.4689, -44.4456], // Resende Centro
  // Itatiaia
  [-22.4900, -44.5200],
  [-22.5100, -44.5800],
  [-22.5300, -44.6400],
  // Queluz (Divisa RJ/SP)
  [-22.5400, -44.7000],
  [-22.5278, -44.7723],
  // Cruzeiro
  [-22.5600, -44.8400],
  [-22.5800, -44.9200],
  // Cachoeira Paulista
  [-22.6200, -45.0000],
  [-22.6600, -45.0600],
  // Lorena
  [-22.7100, -45.1100],
  [-22.7256, -45.1245],
  // Guaratingueta
  [-22.7600, -45.1500],
  [-22.8000, -45.1800],
  [-22.8165, -45.1927],
  // Aparecida
  [-22.8400, -45.2200],
  [-22.8489, -45.2301],
  // Pindamonhangaba
  [-22.9000, -45.3000],
  [-22.9400, -45.3600],
  [-22.9578, -45.3956],
  // Taubate
  [-22.9900, -45.4500],
  [-23.0100, -45.5100],
  [-23.0226, -45.5559],
  // Cacapava
  [-23.0600, -45.6200],
  [-23.0945, -45.7012],
  // Sao Jose dos Campos
  [-23.1300, -45.7700],
  [-23.1600, -45.8400],
  [-23.1896, -45.8840],
  [-23.2100, -45.9200],
  // Jacarei
  [-23.2500, -45.9700],
  [-23.2900, -46.0200],
  [-23.3012, -46.0234],
  // Aruja / Guarulhos
  [-23.3500, -46.0800],
  [-23.3900, -46.1500],
  [-23.4300, -46.2200],
  [-23.4600, -46.3000],
  [-23.4800, -46.4000],
  [-23.4900, -46.5000],
  // Sao Paulo
  [-23.5200, -46.5700],
  [-23.5400, -46.6100],
  [-23.5505, -46.6333],
]

// Encontra o subset de pontos da Via Dutra entre origem e destino
function getRoutePoints(origin?: Location, destination?: Location): [number, number][] {
  if (!origin || !destination) return []
  
  const findClosestIndex = (lat: number, lng: number) => {
    let minDist = Infinity
    let closestIdx = 0
    VIA_DUTRA_POINTS.forEach((point, idx) => {
      const dist = Math.sqrt(Math.pow(point[0] - lat, 2) + Math.pow(point[1] - lng, 2))
      if (dist < minDist) {
        minDist = dist
        closestIdx = idx
      }
    })
    return closestIdx
  }
  
  const originIdx = findClosestIndex(origin.lat, origin.lng)
  const destIdx = findClosestIndex(destination.lat, destination.lng)
  
  const start = Math.min(originIdx, destIdx)
  const end = Math.max(originIdx, destIdx)
  
  const routePoints: [number, number][] = []
  routePoints.push([origin.lat, origin.lng])
  
  const viaPoints = VIA_DUTRA_POINTS.slice(start, end + 1)
  if (originIdx <= destIdx) {
    routePoints.push(...viaPoints)
  } else {
    routePoints.push(...viaPoints.reverse())
  }
  
  routePoints.push([destination.lat, destination.lng])
  return routePoints
}

export function MapPreview({
  origin,
  destination,
  center = { lat: -23.1, lng: -45.0 },
  zoom = 7,
  className,
  showControls = true
}: MapPreviewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const uniqueId = useId()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mapError, setMapError] = useState(false)
  const [L, setL] = useState<any>(null)

  // Calcular centro e zoom baseado em origem/destino
  const calculatedCenter = origin 
    ? { lat: origin.lat, lng: origin.lng }
    : destination 
      ? { lat: destination.lat, lng: destination.lng }
      : center

  const calculatedZoom = origin && destination ? 7 : origin || destination ? 11 : zoom

  // Carregar Leaflet uma vez
  useEffect(() => {
    let mounted = true
    
    const loadLeaflet = async () => {
      try {
        const leaflet = await import('leaflet')
        await import('leaflet/dist/leaflet.css')
        if (mounted) {
          setL(leaflet.default)
        }
      } catch {
        if (mounted) setMapError(true)
      }
    }
    
    loadLeaflet()
    return () => { mounted = false }
  }, [])

  // Inicializar mapa quando Leaflet estiver pronto
  useEffect(() => {
    if (!L || !mapContainerRef.current) return
    
    // Se ja existe um mapa, remove antes de criar novo
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove()
      } catch (e) {
        // Ignora erro se mapa ja foi removido
      }
      mapInstanceRef.current = null
    }

    try {
      // Pequeno delay para garantir que o container esta no DOM
      const timer = setTimeout(() => {
        if (!mapContainerRef.current) return
        
        const mapInstance = L.map(mapContainerRef.current, {
          center: [calculatedCenter.lat, calculatedCenter.lng],
          zoom: calculatedZoom,
          zoomControl: false,
          attributionControl: false
        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(mapInstance)

        mapInstanceRef.current = mapInstance
        setIsLoading(false)

        // Forcar invalidacao de tamanho
        setTimeout(() => {
          mapInstance.invalidateSize()
        }, 100)
      }, 50)

      return () => clearTimeout(timer)
    } catch {
      setMapError(true)
    }
  }, [L, uniqueId])

  // Atualizar markers e rota
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !L) return

    try {
      // Limpar layers anteriores (exceto tile layer)
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          map.removeLayer(layer)
        }
      })

      const originIcon = L.divIcon({
        className: 'custom-marker-origin',
        html: `<div style="width: 18px; height: 18px; background: #50C878; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      })

      const destIcon = L.divIcon({
        className: 'custom-marker-dest',
        html: `<div style="width: 18px; height: 18px; background: white; border: 4px solid #50C878; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      })

      // Desenhar rota
      if (origin && destination) {
        const routePoints = getRoutePoints(origin, destination)
        if (routePoints.length > 1) {
          // Sombra da rota
          L.polyline(routePoints, {
            color: '#50C878',
            weight: 6,
            opacity: 0.3,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(map)
          
          // Rota principal
          L.polyline(routePoints, {
            color: '#50C878',
            weight: 3,
            opacity: 1,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(map)

          // Ajustar bounds
          const bounds = L.latLngBounds(routePoints)
          map.fitBounds(bounds, { padding: [30, 30], maxZoom: 10 })
        }
      }

      // Markers
      if (origin) {
        L.marker([origin.lat, origin.lng], { icon: originIcon })
          .addTo(map)
          .bindPopup(`<b>Saida:</b> ${origin.label || 'Origem'}`)
      }

      if (destination) {
        L.marker([destination.lat, destination.lng], { icon: destIcon })
          .addTo(map)
          .bindPopup(`<b>Chegada:</b> ${destination.label || 'Destino'}`)
      }

      // Centralizar se so tem um ponto
      if (origin && !destination) {
        map.setView([origin.lat, origin.lng], 11)
      } else if (destination && !origin) {
        map.setView([destination.lat, destination.lng], 11)
      }
    } catch {
      // Ignora erros silenciosamente
    }
  }, [L, origin, destination])

  // Atualizar tamanho quando expande
  useEffect(() => {
    const map = mapInstanceRef.current
    if (map) {
      setTimeout(() => {
        try {
          map.invalidateSize()
        } catch (e) {
          // Ignora
        }
      }, 200)
    }
  }, [isExpanded])

  // Estado de erro
  if (mapError) {
    return (
      <div className={cn(
        "bg-zinc-900 rounded-xl flex items-center justify-center border border-border",
        className
      )}>
        <div className="flex flex-col items-center gap-2 text-muted-foreground p-4">
          <MapPin className="h-8 w-8 text-red-500" />
          <span className="text-sm text-center">Erro ao carregar mapa</span>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Overlay quando expandido */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/70 z-[9998]"
          onClick={() => setIsExpanded(false)}
        />
      )}
      
      <div className={cn(
        "relative rounded-xl overflow-hidden border border-border bg-zinc-900",
        isExpanded ? "fixed inset-4 z-[9999]" : "z-0",
        className
      )}>
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-900">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <MapPin className="h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Carregando rota...</span>
            </div>
          </div>
        )}

        {/* Container do mapa */}
        <div 
          ref={mapContainerRef}
          className="h-full w-full min-h-[180px]"
          style={{ background: '#1a1a1a' }}
        />

        {/* Controles */}
        {showControls && !isLoading && (
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-30">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-card/90 backdrop-blur-sm shadow-lg border border-border/50"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((pos) => {
                    mapInstanceRef.current?.setView([pos.coords.latitude, pos.coords.longitude], 13)
                  })
                }
              }}
              title="Minha localizacao"
            >
              <Navigation className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-card/90 backdrop-blur-sm shadow-lg border border-border/50"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Minimizar" : "Expandir"}
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        )}

        {/* Atribuicao */}
        <div className="absolute bottom-1 right-1 text-[8px] text-muted-foreground/60 bg-black/50 px-1.5 py-0.5 rounded z-30">
          OpenStreetMap
        </div>
      </div>
    </>
  )
}
