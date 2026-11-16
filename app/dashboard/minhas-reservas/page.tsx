'use client'

import { useMemo } from 'react'
import { Calendar, History, Ticket } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ReservationCard, type Reservation } from '@/components/reservations/reservation-card'
import { useBookings } from '@/hooks/use-api'
import { bookingsApi } from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'
import { useMessages } from '@/contexts/messages-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Booking } from '@/lib/types'

function toReservation(booking: Booking): Reservation {
  const ride = booking.ride
  return {
    id: booking.id,
    rideId: ride.id,
    status: booking.status,
    seats: booking.seatsBooked,
    totalPrice: ride.price * booking.seatsBooked,
    origin: {
      city: ride.origin.city,
      state: ride.origin.state,
      meetingPoint: ride.origin.meetingPoint ?? '',
    },
    destination: {
      city: ride.destination.city,
      state: ride.destination.state,
    },
    date: ride.date,
    time: ride.time,
    driver: {
      id: ride.driver.id,
      name: ride.driver.name,
      avatar: ride.driver.avatar,
      rating: ride.driver.rating,
    },
    canRate: booking.status === 'completed',
  }
}

export default function MinhasReservasPage() {
  const router = useRouter()
  const { isAuthenticated, openLoginModal } = useAuth()
  const { startConversation } = useMessages()
  const { data: bookings, mutate } = useBookings()

  const reservations = useMemo<Reservation[]>(
    () => (bookings ?? []).map(toReservation),
    [bookings]
  )

  const upcomingReservations = reservations.filter(r => r.status === 'confirmed' || r.status === 'pending')
  const pastReservations = reservations.filter(r => r.status === 'completed' || r.status === 'cancelled')

  const handleRate = (reservationId: string) => {
    router.push(`/dashboard/avaliar/${reservationId}`)
  }

  const handleCancel = async (reservationId: string) => {
    if (!isAuthenticated) {
      openLoginModal('/dashboard/minhas-reservas')
      return
    }
    try {
      await bookingsApi.cancel(reservationId)
      mutate()
    } catch {
      // Falha silenciosa ate o backend estar disponivel (Fase 3)
    }
  }

  const handleMessage = (driverId: string) => {
    if (!isAuthenticated) {
      openLoginModal('/dashboard/minhas-reservas')
      return
    }
    const reservation = reservations.find(r => r.driver.id === driverId)
    if (!reservation) return
    startConversation({
      rideId: reservation.rideId,
      driverId: reservation.driver.id,
      driverName: reservation.driver.name,
      driverAvatar: reservation.driver.avatar,
      rideOrigin: reservation.origin.city,
      rideDestination: reservation.destination.city,
      rideDate: reservation.date,
      ridePrice: reservation.totalPrice,
      initialMessage: 'Olá! Tenho uma reserva nesta carona.',
    })
    router.push('/dashboard/mensagens')
  }

  return (
    <div className="space-y-4 md:space-y-6 px-4 py-4 md:px-6 md:py-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Minhas Reservas</h1>
        <p className="text-sm md:text-base text-muted-foreground">Gerencie suas viagens reservadas</p>
      </div>

      <Tabs defaultValue="proximas" className="w-full">
        <TabsList className="w-full grid grid-cols-2 h-auto p-1">
          <TabsTrigger value="proximas" className="gap-1.5 md:gap-2 text-xs md:text-sm py-2.5 touch-target">
            <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Proximas</span>
            <span className="sm:hidden">Prox.</span>
            <span>({upcomingReservations.length})</span>
          </TabsTrigger>
          <TabsTrigger value="historico" className="gap-1.5 md:gap-2 text-xs md:text-sm py-2.5 touch-target">
            <History className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Historico</span>
            <span className="sm:hidden">Hist.</span>
            <span>({pastReservations.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Proximas */}
        <TabsContent value="proximas" className="mt-3 md:mt-4">
          {upcomingReservations.length === 0 ? (
            <Card className="rounded-xl">
              <CardContent className="py-8 md:py-12 text-center">
                <Ticket className="h-10 w-10 md:h-12 md:w-12 mx-auto text-muted-foreground/50 mb-3 md:mb-4" />
                <h3 className="font-medium text-foreground mb-1 text-sm md:text-base">Nenhuma reserva futura</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-4">
                  Voce ainda nao tem nenhuma viagem agendada.
                </p>
                <Button asChild className="h-10 touch-target">
                  <Link href="/dashboard/buscar">Buscar caronas</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {upcomingReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onRate={handleRate}
                  onCancel={handleCancel}
                  onMessage={handleMessage}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Historico */}
        <TabsContent value="historico" className="mt-3 md:mt-4">
          {pastReservations.length === 0 ? (
            <Card className="rounded-xl">
              <CardContent className="py-8 md:py-12 text-center">
                <History className="h-10 w-10 md:h-12 md:w-12 mx-auto text-muted-foreground/50 mb-3 md:mb-4" />
                <h3 className="font-medium text-foreground mb-1 text-sm md:text-base">Nenhuma viagem realizada</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Seu historico de viagens aparecera aqui.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {pastReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onRate={handleRate}
                  onCancel={handleCancel}
                  onMessage={handleMessage}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
