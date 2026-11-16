'use client'

import { Route, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'
import type { Ride, RouteStop } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface RouteTimelineProps {
  ride: Ride
}

// Constrói uma lista normalizada de pontos a partir das paradas (se houver)
// ou de origem/destino como fallback.
function buildStops(ride: Ride): RouteStop[] {
  if (ride.stops && ride.stops.length > 0) {
    return ride.stops
  }
  return [
    {
      id: 'origin',
      type: 'pickup',
      city: ride.origin.city,
      neighborhood: ride.origin.neighborhood,
      address: ride.origin.meetingPoint,
      time: ride.time,
      lat: ride.originCoords?.lat ?? 0,
      lng: ride.originCoords?.lng ?? 0,
    },
    {
      id: 'destination',
      type: 'dropoff',
      city: ride.destination.city,
      neighborhood: ride.destination.neighborhood,
      address: ride.destination.dropOffPoint,
      time: '',
      lat: ride.destinationCoords?.lat ?? 0,
      lng: ride.destinationCoords?.lng ?? 0,
    },
  ]
}

export function RouteTimeline({ ride }: RouteTimelineProps) {
  const stops = buildStops(ride)
  const pickups = stops.filter((s) => s.type === 'pickup').length
  const dropoffs = stops.filter((s) => s.type === 'dropoff').length

  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Route className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Trajeto da carona</h3>
        </div>
        <span className="text-xs font-medium text-muted-foreground tabular-nums">
          {stops.length} {stops.length === 1 ? 'parada' : 'paradas'}
        </span>
      </div>

      {/* Linha do tempo vertical */}
      <ol className="relative">
        {stops.map((stop, index) => {
          const isLast = index === stops.length - 1
          const isPickup = stop.type === 'pickup'

          return (
            <li key={stop.id} className="relative flex gap-3 pb-5 last:pb-0">
              {/* Conector vertical */}
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-primary/60 to-border"
                />
              )}

              {/* Marcador */}
              <span
                className={cn(
                  'relative z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2',
                  isPickup
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-zinc-500 bg-zinc-800 text-zinc-300'
                )}
              >
                {isPickup ? (
                  <ArrowUpFromLine className="h-3 w-3" />
                ) : (
                  <ArrowDownToLine className="h-3 w-3" />
                )}
              </span>

              {/* Conteúdo */}
              <div className="flex flex-1 items-start justify-between gap-3 -mt-0.5 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate">
                      {stop.city}
                    </p>
                    <span
                      className={cn(
                        'text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0',
                        isPickup
                          ? 'bg-primary/15 text-primary'
                          : 'bg-zinc-700/60 text-zinc-300'
                      )}
                    >
                      {isPickup ? 'Embarque' : 'Desembarque'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {stop.neighborhood} · {stop.address}
                  </p>
                  {stop.passenger && (
                    <p className="text-xs text-muted-foreground/80 mt-1 truncate">
                      Passageiro: {stop.passenger.name}
                    </p>
                  )}
                </div>

                {stop.time && (
                  <span className="text-sm font-semibold text-foreground tabular-nums flex-shrink-0">
                    {stop.time}
                  </span>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      {/* Resumo */}
      <div className="mt-4 pt-4 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <ArrowUpFromLine className="h-3.5 w-3.5 text-primary" />
          {pickups} {pickups === 1 ? 'embarque' : 'embarques'}
        </span>
        <span className="flex items-center gap-1.5">
          <ArrowDownToLine className="h-3.5 w-3.5 text-zinc-400" />
          {dropoffs} {dropoffs === 1 ? 'desembarque' : 'desembarques'}
        </span>
      </div>
    </div>
  )
}
