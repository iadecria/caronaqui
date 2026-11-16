'use client'

import { MapPin, CalendarDays, Clock, Users, Star } from 'lucide-react'
import type { Ride } from '@/lib/mock-data'
import { formatDate, formatPrice } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface RideTicketProps {
  ride: Ride
  code: string
  seats?: number
  className?: string
}

export function RideTicket({ ride, code, seats = 1, className }: RideTicketProps) {
  const total = ride.price * seats

  return (
    <div className={cn('relative bg-card border border-border rounded-2xl overflow-hidden', className)}>
      {/* Faixa superior */}
      <div className="bg-primary/10 px-5 py-3 flex items-center justify-between">
        <span className="text-xs font-medium text-primary uppercase tracking-wide">
          Comprovante de solicitação
        </span>
        <span className="text-xs font-semibold text-primary tabular-nums">{code}</span>
      </div>

      {/* Rota */}
      <div className="px-5 pt-5">
        <div className="flex items-stretch gap-3">
          <div className="flex flex-col items-center pt-1">
            <span className="h-3 w-3 rounded-full border-2 border-primary bg-primary/20" />
            <span className="flex-1 w-0.5 my-1 bg-gradient-to-b from-primary/60 to-border" />
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Saída</p>
              <p className="font-semibold text-foreground truncate">
                {ride.origin.city}, {ride.origin.state}
              </p>
              <p className="text-xs text-muted-foreground truncate">{ride.origin.meetingPoint}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Destino</p>
              <p className="font-semibold text-foreground truncate">
                {ride.destination.city}, {ride.destination.state}
              </p>
              <p className="text-xs text-muted-foreground truncate">{ride.destination.dropOffPoint}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data / hora / lugares */}
      <div className="px-5 py-4 grid grid-cols-3 gap-2 text-center">
        <div>
          <CalendarDays className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
          <p className="text-xs text-muted-foreground">Data</p>
          <p className="text-sm font-medium text-foreground">{formatDate(ride.date)}</p>
        </div>
        <div>
          <Clock className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
          <p className="text-xs text-muted-foreground">Horário</p>
          <p className="text-sm font-medium text-foreground tabular-nums">{ride.time}</p>
        </div>
        <div>
          <Users className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
          <p className="text-xs text-muted-foreground">Lugares</p>
          <p className="text-sm font-medium text-foreground tabular-nums">{seats}</p>
        </div>
      </div>

      {/* Divisor perfurado */}
      <div className="relative">
        <span className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-zinc-950" />
        <span className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-zinc-950" />
        <div className="border-t border-dashed border-border mx-5" />
      </div>

      {/* Motorista + total */}
      <div className="px-5 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ride.driver.avatar || '/placeholder.svg'}
            alt={ride.driver.name}
            className="h-10 w-10 rounded-full object-cover bg-muted flex-shrink-0"
            crossOrigin="anonymous"
          />
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{ride.driver.name}</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-current text-amber-400" />
              {ride.driver.rating.toFixed(1)}
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="font-bold text-lg text-foreground font-mono tabular-nums">
            {formatPrice(total)}
          </p>
        </div>
      </div>
    </div>
  )
}
