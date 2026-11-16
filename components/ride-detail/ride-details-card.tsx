'use client'

import { Clock, MapPin, Users, PawPrint, Cigarette, Luggage } from 'lucide-react'
import type { Ride } from '@/lib/types'
import { formatDate, formatPrice } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { LABELS } from '@/lib/identity'

interface RideDetailsCardProps {
  ride: Ride
}

export function RideDetailsCard({ ride }: RideDetailsCardProps) {
  return (
    <div className="bg-card rounded-lg p-6 border border-border space-y-6">
      {/* Rota e Horário */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Detalhes da viagem</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Saída</p>
              <p className="font-medium">{ride.origin.city}, {ride.origin.state}</p>
              <p className="text-xs text-muted-foreground">{ride.origin.neighborhood} - {ride.origin.meetingPoint}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Destino</p>
              <p className="font-medium">{ride.destination.city}, {ride.destination.state}</p>
              <p className="text-xs text-muted-foreground">{ride.destination.neighborhood} - {ride.destination.dropOffPoint}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Data e hora</p>
              <p className="font-medium">{formatDate(ride.date)} às {ride.time}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vagas e Preço */}
      <div className="pt-4 border-t border-border">
        <h4 className="font-semibold mb-3">Informações adicionais</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">{LABELS.availableSeats}</div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-semibold text-lg">{ride.availableSeats}</span>
            </div>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Preço por pessoa</div>
            <div className="font-semibold text-lg font-mono tabular-nums">{formatPrice(ride.price)}</div>
          </div>
        </div>
      </div>

      {/* Confortos */}
      <div className="pt-4 border-t border-border">
        <h4 className="font-semibold mb-3">O que está incluído</h4>
        <div className="flex flex-wrap gap-2">
          {ride.allowsPets && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <PawPrint className="h-3 w-3" />
              Pets permitidos
            </Badge>
          )}
          {ride.allowsLuggage && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Luggage className="h-3 w-3" />
              Malas grandes
            </Badge>
          )}
          {ride.allowsSmoking && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Cigarette className="h-3 w-3" />
              Smoking permitido
            </Badge>
          )}
          {!ride.allowsPets && !ride.allowsLuggage && !ride.allowsSmoking && (
            <span className="text-sm text-muted-foreground">Sem preferências especiais</span>
          )}
        </div>
      </div>
    </div>
  )
}
