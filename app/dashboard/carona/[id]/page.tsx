'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  Heart,
  ArrowLeft,
  Map,
  Users,
  MessageCircle,
  Send,
  ChevronDown,
  ChevronUp,
  Navigation,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RouteTimeline } from '@/components/ride-detail/route-timeline'
import { DriverInfo } from '@/components/ride-detail/driver-info'
import { RideDetailsCard } from '@/components/ride-detail/ride-details-card'
import { mockRides } from '@/lib/mock-data'
import { useFavorites } from '@/contexts/favorites-context'
import { useAuth } from '@/contexts/auth-context'
import { useMessages } from '@/contexts/messages-context'
import { cn } from '@/lib/utils'

const RouteMap = dynamic(() => import('@/components/ride-detail/route-map').then(mod => ({ default: mod.RouteMap })), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-muted rounded-lg animate-pulse" />
})

export default function RideDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isAuthenticated, openLoginModal, pendingAction, setPendingAction, user } = useAuth()
  const { startConversation } = useMessages()

  const rideId = params.id as string
  const ride = mockRides.find(r => r.id === rideId)

  const [showDetails, setShowDetails] = useState(false)

  if (!ride) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <h1 className="text-xl font-bold mb-2">Carona nao encontrada</h1>
        <p className="text-muted-foreground mb-4 text-sm">Esta carona nao existe ou foi removida.</p>
        <Button onClick={() => router.back()}>Voltar</Button>
      </div>
    )
  }

  const favorited = isFavorite(ride.id)

  const routeData = {
    from: { name: `${ride.origin.city}, ${ride.origin.state}`, lat: ride.originCoords?.lat ?? -22.9, lng: ride.originCoords?.lng ?? -43.17 },
    to:   { name: `${ride.destination.city}, ${ride.destination.state}`, lat: ride.destinationCoords?.lat ?? -23.55, lng: ride.destinationCoords?.lng ?? -46.63 },
  }

  // Calcula distância e tempo estimado
  const origin = ride.originCoords ? { lat: ride.originCoords.lat, lng: ride.originCoords.lng } : { lat: -22.9, lng: -43.17 }
  const destination = ride.destinationCoords ? { lat: ride.destinationCoords.lat, lng: ride.destinationCoords.lng } : { lat: -23.55, lng: -46.63 }
  
  // Calcula distância usando Haversine
  const R = 6371
  const dLat = ((destination.lat - origin.lat) * Math.PI) / 180
  const dLng = ((destination.lng - origin.lng) * Math.PI) / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((origin.lat * Math.PI) / 180) * Math.cos((destination.lat * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = Math.round(R * c * 10) / 10
  
  // Calcula tempo estimado (80 km/h médio)
  const hours = distance / 80
  const wholeHours = Math.floor(hours)
  const minutes = Math.round((hours - wholeHours) * 60)
  const travelTime = wholeHours === 0 ? `${minutes}min` : minutes === 0 ? `${wholeHours}h` : `${wholeHours}h ${minutes}min`
  
  const routeInfo = { distance, travelTime }

  // --- handlers ---

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      openLoginModal(`/dashboard/carona/${rideId}`)
    } else {
      toggleFavorite(ride.id)
    }
  }

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      openLoginModal(`/dashboard/carona/${rideId}`, {
        type: 'send_message',
        payload: { rideId, driverName: ride.driver.name },
      })
      return
    }
    // Autenticado: vai direto para conversa
    const conversationId = startConversation({
      rideId: ride.id,
      driverId: ride.driver.id,
      driverName: ride.driver.name,
      driverAvatar: ride.driver.avatar,
      rideOrigin: ride.origin.city,
      rideDestination: ride.destination.city,
      rideDate: ride.date,
      ridePrice: ride.price,
      initialMessage: `Ola ${ride.driver.name.split(' ')[0]}! Tenho interesse na sua carona.`
    })
    router.push(`/dashboard/mensagens/${conversationId}`)
  }

  const handleRequestRide = () => {
    if (!isAuthenticated) {
      openLoginModal(`/dashboard/carona/${rideId}`, {
        type: 'request_ride',
        payload: { rideId },
      })
      return
    }
    // Autenticado: cria solicitacao e mostra o comprovante estilo bilhete
    router.push(`/dashboard/carona/${rideId}/confirmado`)
  }



  // ---- render do painel de acao ----

  const renderActionPanel = () => {
    // Estado: idle — botoes de enviar mensagem e solicitar carona
    return (
      <div className="space-y-3">
        {/* Botao 1: Enviar mensagem */}
        <Button
          size="lg"
          variant="outline"
          className="w-full h-11 gap-2"
          onClick={handleSendMessage}
        >
          <MessageCircle className="h-4 w-4" />
          Enviar mensagem
        </Button>

        {/* Botao 2: Solicitar carona */}
        <Button
          size="lg"
          className="w-full h-11 gap-2"
          onClick={handleRequestRide}
        >
          <Send className="h-4 w-4" />
          Solicitar carona
          <span className="text-primary-foreground/70 font-normal text-sm">
            · {ride.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </Button>

        {!isAuthenticated && (
          <p className="text-xs text-center text-muted-foreground">
            Voce precisara fazer login para continuar
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="px-4 py-4 md:px-6 md:py-6 space-y-4 md:space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-10 w-10 flex-shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-base md:text-xl font-bold flex-1 truncate">
          {ride.origin.city} <span className="text-muted-foreground font-normal">→</span> {ride.destination.city}
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleFavorite}
          className="h-10 w-10 flex-shrink-0"
          aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart
            className={cn('h-5 w-5 transition-colors', favorited && 'fill-current text-red-500')}
            color={favorited ? '#ef4444' : 'currentColor'}
          />
        </Button>
      </div>

      {/* Mapa */}
      <div className="relative rounded-xl overflow-hidden">
        <RouteMap from={routeData.from} to={routeData.to} />
        <Button
          onClick={() => router.push(`/dashboard/carona/${rideId}/mapa`)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 shadow-lg gap-2 h-9"
          size="sm"
        >
          <Map className="h-4 w-4" />
          Ver rota completa
          {ride.passengers && ride.passengers.length > 0 && (
            <span className="flex items-center gap-1 text-primary-foreground/70">
              <Users className="h-3 w-3" />
              {ride.passengers.length}
            </span>
          )}
        </Button>
      </div>

      {/* Informações da rota */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 bg-card rounded-lg border border-border p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Navigation className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Distância</div>
            <div className="text-sm font-semibold">{routeInfo.distance} km</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-card rounded-lg border border-border p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Tempo</div>
            <div className="text-sm font-semibold">{routeInfo.travelTime}</div>
          </div>
        </div>
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

        {/* Coluna principal: detalhes da viagem */}
        <div className="lg:col-span-2 space-y-4">
          {/* Trajeto: linha do tempo de embarques e desembarques */}
          <RouteTimeline ride={ride} />

          {/* Em mobile, detalhes ficam colapsaveis para dar destaque ao painel de acao */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowDetails(v => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium"
            >
              <span>Detalhes da viagem</span>
              {showDetails
                ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                : <ChevronDown className="h-4 w-4 text-muted-foreground" />
              }
            </button>
            {showDetails && (
              <div className="mt-3">
                <RideDetailsCard ride={ride} />
              </div>
            )}
          </div>

          {/* Desktop: sempre visivel */}
          <div className="hidden lg:block">
            <RideDetailsCard ride={ride} />
          </div>
        </div>

        {/* Sidebar: motorista + painel de acao */}
        <div className="space-y-4">
          <DriverInfo
            driver={ride.driver}
            carModel={ride.carModel}
            carColor={ride.carColor}
          />
          {renderActionPanel()}
        </div>
      </div>
    </div>
  )
}
