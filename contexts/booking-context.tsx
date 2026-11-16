'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { useAuth } from './auth-context'

export interface PendingBooking {
  rideId: string
  seats: number
  seatPreference: 'window' | 'aisle' | 'any'
  totalPrice: number
  rideName: string // "Origem → Destino"
  rideDate: string
  rideTime: string
}

interface BookingContextType {
  // Estado da reserva pendente
  pendingBooking: PendingBooking | null
  setPendingBooking: (booking: PendingBooking | null) => void
  
  // Modal de reserva
  isBookingModalOpen: boolean
  setBookingModalOpen: (open: boolean) => void
  selectedRideId: string | null
  setSelectedRideId: (id: string | null) => void
  
  // Funcoes auxiliares
  startBooking: (rideId: string) => void
  completeBooking: (booking: PendingBooking) => Promise<boolean>
  cancelBooking: () => void
  hasPendingBooking: () => boolean
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

const PENDING_BOOKING_KEY = 'caronaqui_pending_booking'

export function BookingProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, setShowLoginModal, setLoginRedirectPath } = useAuth()
  
  const [pendingBooking, setPendingBookingState] = useState<PendingBooking | null>(null)
  const [isBookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null)

  // Carrega reserva pendente do localStorage ao iniciar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(PENDING_BOOKING_KEY)
      if (saved) {
        try {
          const booking = JSON.parse(saved) as PendingBooking
          setPendingBookingState(booking)
        } catch {
          localStorage.removeItem(PENDING_BOOKING_KEY)
        }
      }
    }
  }, [])

  // Quando usuario faz login e tem reserva pendente, retoma automaticamente
  useEffect(() => {
    if (isAuthenticated && pendingBooking) {
      // Abre o modal de confirmacao da reserva
      setSelectedRideId(pendingBooking.rideId)
      setBookingModalOpen(true)
    }
  }, [isAuthenticated, pendingBooking])

  // Salva/remove reserva pendente no localStorage
  const setPendingBooking = useCallback((booking: PendingBooking | null) => {
    setPendingBookingState(booking)
    if (typeof window !== 'undefined') {
      if (booking) {
        localStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(booking))
      } else {
        localStorage.removeItem(PENDING_BOOKING_KEY)
      }
    }
  }, [])

  // Inicia processo de reserva
  const startBooking = useCallback((rideId: string) => {
    setSelectedRideId(rideId)
    setBookingModalOpen(true)
  }, [])

  // Completa a reserva (chamado apos usuario confirmar no modal)
  const completeBooking = useCallback(async (booking: PendingBooking): Promise<boolean> => {
    // Se nao esta logado, salva reserva e pede login
    if (!isAuthenticated) {
      setPendingBooking(booking)
      setBookingModalOpen(false)
      setLoginRedirectPath(`/dashboard/carona/${booking.rideId}`)
      setShowLoginModal(true)
      return false
    }

    // Simula chamada de API para criar reserva
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Limpa reserva pendente apos sucesso
    setPendingBooking(null)
    setBookingModalOpen(false)
    setSelectedRideId(null)
    
    return true
  }, [isAuthenticated, setPendingBooking, setLoginRedirectPath, setShowLoginModal])

  // Cancela reserva
  const cancelBooking = useCallback(() => {
    setPendingBooking(null)
    setBookingModalOpen(false)
    setSelectedRideId(null)
  }, [setPendingBooking])

  // Verifica se tem reserva pendente
  const hasPendingBooking = useCallback(() => {
    return pendingBooking !== null
  }, [pendingBooking])

  return (
    <BookingContext.Provider
      value={{
        pendingBooking,
        setPendingBooking,
        isBookingModalOpen,
        setBookingModalOpen,
        selectedRideId,
        setSelectedRideId,
        startBooking,
        completeBooking,
        cancelBooking,
        hasPendingBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking deve ser usado dentro de um BookingProvider')
  }
  return context
}
