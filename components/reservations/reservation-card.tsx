'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, MapPin, User, MessageCircle, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

export type ReservationStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled'

export interface Reservation {
  id: string
  rideId: string
  status: ReservationStatus
  seats: number
  totalPrice: number
  origin: {
    city: string
    state: string
    meetingPoint: string
  }
  destination: {
    city: string
    state: string
  }
  date: string
  time: string
  driver: {
    id: string
    name: string
    avatar: string
    rating: number
  }
  canRate?: boolean
}

interface ReservationCardProps {
  reservation: Reservation
  onRate?: (reservationId: string) => void
  onCancel?: (reservationId: string) => void
  onMessage?: (driverId: string) => void
}

const statusConfig: Record<ReservationStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  confirmed: { label: 'Confirmada', variant: 'default' },
  pending: { label: 'Pendente', variant: 'secondary' },
  completed: { label: 'Concluida', variant: 'outline' },
  cancelled: { label: 'Cancelada', variant: 'destructive' },
}

export function ReservationCard({ reservation, onRate, onCancel, onMessage }: ReservationCardProps) {
  const status = statusConfig[reservation.status]
  const isUpcoming = reservation.status === 'confirmed' || reservation.status === 'pending'
  const canCancel = isUpcoming && new Date(reservation.date) > new Date()

  return (
    <Card className={cn(
      "overflow-hidden",
      reservation.status === 'cancelled' && "opacity-60"
    )}>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Driver info */}
          <div className="flex items-center gap-3 sm:w-48">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={reservation.driver.avatar}
                alt={reservation.driver.name}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="font-medium truncate">{reservation.driver.name}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{reservation.driver.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Trip details */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium">{reservation.origin.city}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-medium">{reservation.destination.city}</span>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Ponto de encontro: {reservation.origin.meetingPoint}
                </p>
              </div>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(reservation.date).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{reservation.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{reservation.seats} {reservation.seats > 1 ? 'lugares' : 'lugar'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <p className="font-semibold text-primary font-mono tabular-nums">
                {formatPrice(reservation.totalPrice)}
              </p>
              
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
                {isUpcoming && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3"
                    onClick={() => onMessage?.(reservation.driver.id)}
                  >
                    <MessageCircle className="h-4 w-4 sm:mr-1.5" />
                    <span className="hidden sm:inline">Mensagem</span>
                  </Button>
                )}
                
                {reservation.status === 'completed' && reservation.canRate && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-3"
                    onClick={() => onRate?.(reservation.id)}
                  >
                    <Star className="h-4 w-4 sm:mr-1.5" />
                    <span className="hidden sm:inline">Avaliar</span>
                  </Button>
                )}
                
                {canCancel && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 text-destructive hover:text-destructive"
                    onClick={() => onCancel?.(reservation.id)}
                  >
                    <span className="hidden sm:inline">Cancelar</span>
                    <span className="sm:hidden">X</span>
                  </Button>
                )}
                
                <Button variant="outline" size="sm" className="h-9 px-3" asChild>
                  <Link href={`/dashboard/carona/${reservation.rideId}`}>
                    <span className="hidden sm:inline">Ver detalhes</span>
                    <span className="sm:hidden">Ver</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
