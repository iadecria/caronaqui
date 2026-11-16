"use client"

import { MapPin, Navigation } from "lucide-react"
import { cn } from "@/lib/utils"

interface MapPlaceholderProps {
  origin?: string
  destination?: string
  className?: string
  showRoute?: boolean
  height?: string
}

export function MapPlaceholder({
  origin,
  destination,
  className,
  showRoute = true,
  height = "h-48"
}: MapPlaceholderProps) {
  return (
    <div className={cn(
      "relative rounded-2xl overflow-hidden bg-muted/50",
      height,
      className
    )}>
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Simulated route line */}
      {showRoute && origin && destination && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M 20 80 Q 35 60 50 50 T 80 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 2"
            className="text-primary/60"
          />
        </svg>
      )}
      
      {/* Origin marker */}
      {origin && (
        <div className="absolute left-[15%] bottom-[20%] flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <div className="w-3 h-3 rounded-full bg-primary-foreground" />
          </div>
          <div className="mt-1 px-2 py-0.5 bg-card/90 backdrop-blur rounded-md text-[10px] font-medium text-foreground truncate max-w-[80px]">
            {origin}
          </div>
        </div>
      )}
      
      {/* Destination marker */}
      {destination && (
        <div className="absolute right-[15%] top-[15%] flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
            <MapPin className="w-4 h-4 text-accent-foreground" />
          </div>
          <div className="mt-1 px-2 py-0.5 bg-card/90 backdrop-blur rounded-md text-[10px] font-medium text-foreground truncate max-w-[80px]">
            {destination}
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {!origin && !destination && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
          <Navigation className="w-8 h-8 mb-2 opacity-50" />
          <span className="text-xs">Mapa da rota</span>
        </div>
      )}
      
      {/* Leaflet attribution placeholder */}
      <div className="absolute bottom-2 right-2 text-[8px] text-muted-foreground/50">
        Leaflet | OpenStreetMap
      </div>
    </div>
  )
}
