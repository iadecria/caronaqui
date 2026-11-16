'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  Check,
  Minus,
  Plus,
  Armchair
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'
import { useBooking, type PendingBooking } from '@/contexts/booking-context'
import { useAuth } from '@/contexts/auth-context'
import type { Ride } from '@/lib/mock-data'
import { formatPrice, formatDate } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'

interface ReservationModalProps {
  ride: Ride | null
}

type SeatPreference = 'window' | 'aisle' | 'any'

const seatPreferences: { value: SeatPreference; label: string; icon: string }[] = [
  { value: 'any', label: 'Qualquer', icon: '🪑' },
  { value: 'window', label: 'Janela', icon: '🪟' },
  { value: 'aisle', label: 'Corredor', icon: '🚶' },
]

export function ReservationModal({ ride }: ReservationModalProps) {
  const isMobile = useIsMobile()
  const { isAuthenticated } = useAuth()
  const { 
    isBookingModalOpen, 
    setBookingModalOpen, 
    pendingBooking,
    completeBooking,
    cancelBooking
  } = useBooking()

  // Estados do formulario
  const [seats, setSeats] = useState(1)
  const [seatPreference, setSeatPreference] = useState<SeatPreference>('any')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Restaura dados de reserva pendente se existir
  useEffect(() => {
    if (pendingBooking && isBookingModalOpen) {
      setSeats(pendingBooking.seats)
      setSeatPreference(pendingBooking.seatPreference)
    }
  }, [pendingBooking, isBookingModalOpen])

  // Reset ao fechar
  useEffect(() => {
    if (!isBookingModalOpen) {
      setSeats(1)
      setSeatPreference('any')
      setIsLoading(false)
      setIsSuccess(false)
    }
  }, [isBookingModalOpen])

  if (!ride) return null

  const maxSeats = ride.availableSeats
  const pricePerSeat = parseInt(ride.price.replace(/[^\d]/g, ''))
  const totalPrice = pricePerSeat * seats

  const handleDecrementSeats = () => {
    if (seats > 1) setSeats(seats - 1)
  }

  const handleIncrementSeats = () => {
    if (seats < maxSeats) setSeats(seats + 1)
  }

  const handleConfirm = async () => {
    setIsLoading(true)

    const booking: PendingBooking = {
      rideId: ride.id,
      seats,
      seatPreference,
      totalPrice,
      rideName: `${ride.origin.city} → ${ride.destination.city}`,
      rideDate: ride.date,
      rideTime: ride.time,
    }

    const success = await completeBooking(booking)
    
    if (success) {
      setIsSuccess(true)
      // Fecha apos mostrar sucesso
      setTimeout(() => {
        setBookingModalOpen(false)
      }, 2000)
    }
    
    setIsLoading(false)
  }

  const content = (
    <div className="space-y-6">
      {isSuccess ? (
        // Estado de sucesso
        <div className="py-8 text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">Reserva confirmada!</h3>
            <p className="text-muted-foreground mt-1">
              Voce reservou {seats} {seats === 1 ? 'assento' : 'assentos'}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Redirecionando para suas reservas...
          </p>
        </div>
      ) : (
        <>
          {/* Resumo da carona */}
          <div className="bg-muted/50 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">
                  {ride.origin.city} → {ride.destination.city}
                </p>
                <p className="text-sm text-muted-foreground">
                  {ride.origin.neighborhood} → {ride.destination.neighborhood}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(ride.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {ride.time}
              </span>
            </div>
          </div>

          {/* Selecao de assentos */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Quantidade de assentos
            </label>
            <div className="flex items-center justify-between bg-muted rounded-xl p-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDecrementSeats}
                disabled={seats <= 1}
                className="h-10 w-10 rounded-lg"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <span className="text-2xl font-bold text-foreground tabular-nums">{seats}</span>
                <p className="text-xs text-muted-foreground">
                  {maxSeats} {maxSeats === 1 ? 'disponivel' : 'disponiveis'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleIncrementSeats}
                disabled={seats >= maxSeats}
                className="h-10 w-10 rounded-lg"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Preferencia de assento */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Armchair className="h-4 w-4 text-muted-foreground" />
              Preferencia de posicao
            </label>
            <div className="grid grid-cols-3 gap-2">
              {seatPreferences.map((pref) => (
                <button
                  key={pref.value}
                  onClick={() => setSeatPreference(pref.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-xl border transition-all",
                    seatPreference === pref.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  )}
                >
                  <span className="text-xl">{pref.icon}</span>
                  <span className="text-xs font-medium">{pref.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              A preferencia sera comunicada ao motorista, mas nao e garantida.
            </p>
          </div>

          {/* Resumo do preco */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatPrice(pricePerSeat)} x {seats} {seats === 1 ? 'assento' : 'assentos'}</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-foreground">
              <span>Total</span>
              <span className="text-primary">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* Botoes de acao */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => cancelBooking()}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  {isAuthenticated ? 'Confirmando...' : 'Fazendo login...'}
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  {isAuthenticated ? 'Confirmar reserva' : 'Fazer login e reservar'}
                </>
              )}
            </Button>
          </div>

          {!isAuthenticated && (
            <p className="text-xs text-center text-muted-foreground">
              Voce sera redirecionado para fazer login antes de confirmar.
            </p>
          )}
        </>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={isBookingModalOpen} onOpenChange={setBookingModalOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {isSuccess ? 'Sucesso!' : 'Reservar carona'}
            </DrawerTitle>
            <DrawerDescription>
              {isSuccess 
                ? 'Sua reserva foi confirmada'
                : `${ride.origin.city} → ${ride.destination.city}`
              }
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={isBookingModalOpen} onOpenChange={setBookingModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isSuccess ? 'Sucesso!' : 'Reservar carona'}
          </DialogTitle>
          <DialogDescription>
            {isSuccess 
              ? 'Sua reserva foi confirmada'
              : `${ride.origin.city} → ${ride.destination.city}`
            }
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}
