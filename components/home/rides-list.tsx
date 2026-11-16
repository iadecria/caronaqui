'use client'

import { useState, useEffect } from 'react'
import type { Ride } from "@/lib/mock-data"
import { RideCard } from "./ride-card"

interface RidesListProps {
  rides: Ride[]
  title?: string
  requiresAuth?: boolean
}

export function RidesList({ rides, title = "Proximas Caronas", requiresAuth = false }: RidesListProps) {
  // Evita mismatch de hidratacao - mostra contagem so no cliente
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section>
      {/* Header com titulo e contador */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <span className="text-xs font-medium text-muted-foreground bg-muted/80 px-2.5 py-1 rounded-lg tabular-nums">
          {mounted ? `${rides.length} disponiveis` : 'Carregando...'}
        </span>
      </div>
      
      {/* Mobile: Stack vertical | Desktop: Grid 2 cols */}
      <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4">
        {rides.map((ride) => (
          <RideCard key={ride.id} ride={ride} requiresAuth={requiresAuth} />
        ))}
      </div>
    </section>
  )
}
