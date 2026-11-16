'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useRide } from '@/hooks/use-api'
import { useBooking } from '@/contexts/booking-context'
import { ReservationModal } from '@/components/booking/reservation-modal'
import { Button } from '@/components/ui/button'

export default function ReservarPage() {
  const params = useParams()
  const router = useRouter()
  const rideId = params.id as string
  const { data: ride, isLoading } = useRide(rideId)
  const { startBooking, isBookingModalOpen } = useBooking()

  // Abre o modal de reserva ao entrar na rota
  useEffect(() => {
    if (ride && !isBookingModalOpen) {
      startBooking(ride.id)
    }
  }, [ride, isBookingModalOpen, startBooking])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <p className="text-muted-foreground text-sm">Carregando carona...</p>
      </div>
    )
  }

  if (!ride) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <h1 className="text-xl font-bold mb-2">Carona nao encontrada</h1>
        <p className="text-muted-foreground mb-4 text-sm">Esta carona nao existe ou foi removida.</p>
        <Button onClick={() => router.push('/dashboard/buscar')}>Buscar caronas</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-background border-b border-border p-4 z-10 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-primary hover:text-primary/80 transition-colors p-2 -ml-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">Reservar carona</h1>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto text-sm text-muted-foreground">
        {ride.origin.city} → {ride.destination.city}
      </div>

      <ReservationModal ride={ride} />
    </div>
  )
}
