'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import type { AddressSuggestion } from '@/hooks/use-address-search'
import { cn } from '@/lib/utils'

// Importa o mapa dinamicamente para evitar problemas com SSR
const MapContent = dynamic(() => import('./search-route-map-content').then(mod => mod.MapContent), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
        <span className="text-xs text-muted-foreground">Carregando mapa...</span>
      </div>
    </div>
  )
})

interface SearchRouteMapProps {
  origin?: AddressSuggestion
  destination?: AddressSuggestion
  isLoading?: boolean
  className?: string
}

export function SearchRouteMap({
  origin,
  destination,
  isLoading = false,
  className
}: SearchRouteMapProps) {
  // Se não tem origem e destino, não renderiza o mapa
  if (!origin || !destination) {
    return null
  }

  return (
    <Suspense fallback={
      <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center rounded-xl">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-xs text-muted-foreground">Carregando mapa...</span>
        </div>
      </div>
    }>
      <div className={cn(
        "relative rounded-xl overflow-hidden border border-border/50 bg-muted",
        isLoading && "opacity-70 pointer-events-none",
        className
      )}>
        <MapContent 
          origin={origin} 
          destination={destination} 
          isLoading={isLoading} 
        />
      </div>
    </Suspense>
  )
}
