'use client'

import { useState } from 'react'
import { Calendar, History, Ticket } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ReservationCard, type Reservation } from '@/components/reservations/reservation-card'
import Link from 'next/link'

// Mock reservations
const mockReservations: Reservation[] = [
  {
    id: 'res1',
    rideId: 'r1',
    status: 'confirmed',
    seats: 2,
    totalPrice: 170,
    origin: {
      city: 'Rio de Janeiro',
      state: 'RJ',
      meetingPoint: 'Estacao Central do Brasil'
    },
    destination: {
      city: 'Sao Paulo',
      state: 'SP'
    },
    date: '2026-04-18',
    time: '06:00',
    driver: {
      id: 'd1',
      name: 'Carlos Silva',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
      rating: 4.9
    }
  },
  {
    id: 'res2',
    rideId: 'r2',
    status: 'pending',
    seats: 1,
    totalPrice: 90,
    origin: {
      city: 'Sao Paulo',
      state: 'SP',
      meetingPoint: 'Shopping Ibirapuera'
    },
    destination: {
      city: 'Rio de Janeiro',
      state: 'RJ'
    },
    date: '2026-04-20',
    time: '07:30',
    driver: {
      id: 'd2',
      name: 'Ana Oliveira',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
      rating: 4.8
    }
  },
  {
    id: 'res3',
    rideId: 'r3',
    status: 'completed',
    seats: 1,
    totalPrice: 80,
    origin: {
      city: 'Rio de Janeiro',
      state: 'RJ',
      meetingPoint: 'Metro Saens Pena'
    },
    destination: {
      city: 'Sao Paulo',
      state: 'SP'
    },
    date: '2026-04-10',
    time: '05:30',
    driver: {
      id: 'd3',
      name: 'Roberto Santos',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto',
      rating: 4.7
    },
    canRate: true
  },
  {
    id: 'res4',
    rideId: 'r4',
    status: 'completed',
    seats: 2,
    totalPrice: 190,
    origin: {
      city: 'Sao Paulo',
      state: 'SP',
      meetingPoint: 'Metro Ana Rosa'
    },
    destination: {
      city: 'Rio de Janeiro',
      state: 'RJ'
    },
    date: '2026-04-05',
    time: '14:00',
    driver: {
      id: 'd4',
      name: 'Fernanda Costa',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fernanda',
      rating: 5.0
    },
    canRate: false
  },
  {
    id: 'res5',
    rideId: 'r5',
    status: 'cancelled',
    seats: 1,
    totalPrice: 88,
    origin: {
      city: 'Rio de Janeiro',
      state: 'RJ',
      meetingPoint: 'Metro Botafogo'
    },
    destination: {
      city: 'Sao Paulo',
      state: 'SP'
    },
    date: '2026-03-28',
    time: '08:00',
    driver: {
      id: 'd5',
      name: 'Marcos Pereira',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcos',
      rating: 4.6
    }
  }
]

export default function MinhasReservasPage() {
  const [reservations] = useState(mockReservations)
  
  const upcomingReservations = reservations.filter(r => r.status === 'confirmed' || r.status === 'pending')
  const pastReservations = reservations.filter(r => r.status === 'completed' || r.status === 'cancelled')

  const handleRate = (reservationId: string) => {
    console.log('Rating reservation:', reservationId)
    // TODO: Open rating modal
  }

  const handleCancel = (reservationId: string) => {
    console.log('Cancelling reservation:', reservationId)
    // TODO: Confirm and cancel
  }

  const handleMessage = (driverId: string) => {
    console.log('Messaging driver:', driverId)
    // TODO: Open chat
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
