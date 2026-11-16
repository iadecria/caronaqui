'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  Car,
  ChevronDown,
  ChevronUp,
  Navigation,
  User,
  CircleDot,
  Circle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useRide } from '@/hooks/use-api'
import type { Ride, Passenger, RouteStop } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'
import dynamic from 'next/dynamic'

// Importacao dinamica do mapa para evitar SSR issues
const RouteMapDetailed = dynamic(
  () => import('@/components/ride-detail/route-map-detailed').then(mod => mod.RouteMapDetailed),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Carregando mapa...</div>
      </div>
    )
  }
)

export default function RideMapPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, openLoginModal, user } = useAuth()
  const [showParticipants, setShowParticipants] = useState(true)
  const [selectedStop, setSelectedStop] = useState<string | null>(null)
  
  const rideId = params.id as string
  const { data: ride, isLoading } = useRide(rideId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p className="text-muted-foreground text-sm">Carregando carona...</p>
      </div>
    )
  }

  if (!ride) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">Carona nao encontrada</h1>
          <p className="text-muted-foreground mb-4">A carona que voce procura nao existe.</p>
          <Button onClick={() => router.back()}>Voltar</Button>
        </div>
      </div>
    )
  }

  // Verifica se o usuario atual e o motorista
  const isDriver = user?.id === ride.driver.id
  const passengers = ride.passengers || []
  const stops = ride.stops || []
  const bookedSeats = passengers.reduce((acc, p) => acc + p.seatsBooked, 0)
  const occupancyPercent = Math.round((bookedSeats / ride.totalSeats) * 100)

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header fixo */}
      <header className="flex-shrink-0 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 z-20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-9 w-9 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-foreground truncate">
              {ride.origin.city} → {ride.destination.city}
            </h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{ride.time}</span>
              <span className="text-border">|</span>
              <Users className="h-3 w-3" />
              <span>{bookedSeats}/{ride.totalSeats} lugares</span>
            </div>
          </div>
          <Badge variant={isDriver ? "default" : "secondary"} className="flex-shrink-0">
            {isDriver ? "Voce oferece" : "Passageiro"}
          </Badge>
        </div>
      </header>

      {/* Mapa interativo - ocupa espaco restante */}
      <div className="flex-1 relative">
        <RouteMapDetailed 
          ride={ride}
          selectedStop={selectedStop}
          onStopSelect={setSelectedStop}
        />
        
        {/* Overlay de ocupacao */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-card/95 backdrop-blur-sm rounded-xl p-3 border border-border/50 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Car className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Ocupacao</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all",
                    occupancyPercent >= 75 ? "bg-amber-500" : "bg-primary"
                  )}
                  style={{ width: `${occupancyPercent}%` }}
                />
              </div>
              <span className="text-xs font-mono tabular-nums text-muted-foreground">
                {bookedSeats}/{ride.totalSeats}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Painel inferior com participantes e rota */}
      <div className={cn(
        "flex-shrink-0 bg-card border-t border-border/50 transition-all duration-300",
        showParticipants ? "max-h-[45vh]" : "max-h-16"
      )}>
        {/* Toggle header */}
        <button
          onClick={() => setShowParticipants(!showParticipants)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {/* Avatar do motorista */}
              <Avatar className="h-8 w-8 border-2 border-card">
                <AvatarImage src={ride.driver.avatar} alt={ride.driver.name} />
                <AvatarFallback>{ride.driver.name[0]}</AvatarFallback>
              </Avatar>
              {/* Avatares dos passageiros */}
              {passengers.slice(0, 3).map((p) => (
                <Avatar key={p.id} className="h-8 w-8 border-2 border-card">
                  <AvatarImage src={p.avatar} alt={p.name} />
                  <AvatarFallback>{p.name[0]}</AvatarFallback>
                </Avatar>
              ))}
              {passengers.length > 3 && (
                <div className="h-8 w-8 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                  <span className="text-xs font-medium">+{passengers.length - 3}</span>
                </div>
              )}
            </div>
            <div>
              <span className="text-sm font-medium">{1 + passengers.length} participantes</span>
              <span className="text-xs text-muted-foreground ml-2">
                {stops.length} paradas
              </span>
            </div>
          </div>
          {showParticipants ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          )}
        </button>

        {/* Conteudo expandido */}
        {showParticipants && (
          <div className="px-4 pb-4 overflow-y-auto max-h-[calc(45vh-48px)]">
            {/* Timeline de paradas */}
            <div className="space-y-0">
              {stops.map((stop, index) => (
                <StopItem 
                  key={stop.id}
                  stop={stop}
                  isFirst={index === 0}
                  isLast={index === stops.length - 1}
                  isSelected={selectedStop === stop.id}
                  onClick={() => setSelectedStop(stop.id)}
                  driverName={ride.driver.name}
                  isDriver={isDriver}
                />
              ))}
            </div>

            {/* Secao de participantes */}
            <div className="mt-6 pt-4 border-t border-border/50">
              <h3 className="text-sm font-semibold mb-3">Quem participa</h3>
              
              {/* Motorista */}
              <ParticipantCard 
                participant={{
                  id: ride.driver.id,
                  name: ride.driver.name,
                  avatar: ride.driver.avatar,
                  rating: ride.driver.rating,
                  role: 'driver',
                  origin: `${ride.origin.neighborhood}, ${ride.origin.city}`,
                  destination: `${ride.destination.neighborhood}, ${ride.destination.city}`
                }}
                isCurrentUser={isDriver}
              />

              {/* Passageiros */}
              {passengers.map((p) => (
                <ParticipantCard 
                  key={p.id}
                  participant={{
                    id: p.id,
                    name: p.name,
                    avatar: p.avatar,
                    rating: p.rating,
                    role: 'passenger',
                    origin: `${p.origin.neighborhood}, ${p.origin.city}`,
                    destination: `${p.destination.neighborhood}, ${p.destination.city}`,
                    seatsBooked: p.seatsBooked,
                    status: p.status
                  }}
                  isCurrentUser={user?.id === p.id}
                />
              ))}

              {/* Vagas disponiveis */}
              {ride.availableSeats > 0 && (
                <div className="mt-3 p-3 border border-dashed border-border rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {ride.availableSeats} {ride.availableSeats === 1 ? 'vaga disponivel' : 'vagas disponiveis'}
                    </span>
                  </div>
                  {!isDriver && (
                    <Button 
                      size="sm"
                      onClick={() => {
                        if (!isAuthenticated) {
                          openLoginModal()
                        } else {
                          router.push(`/dashboard/carona/${rideId}/reservar`)
                        }
                      }}
                    >
                      Reservar
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente para item de parada na timeline
interface StopItemProps {
  stop: RouteStop
  isFirst: boolean
  isLast: boolean
  isSelected: boolean
  onClick: () => void
  driverName: string
  isDriver: boolean
}

function StopItem({ stop, isFirst, isLast, isSelected, onClick, driverName, isDriver }: StopItemProps) {
  const isPickup = stop.type === 'pickup'
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 py-3 px-2 rounded-lg transition-colors text-left",
        isSelected ? "bg-primary/10" : "hover:bg-muted/50"
      )}
    >
      {/* Timeline visual */}
      <div className="relative flex flex-col items-center">
        {!isFirst && (
          <div className="absolute bottom-full w-0.5 h-3 bg-border" />
        )}
        <div className={cn(
          "w-4 h-4 rounded-full flex items-center justify-center z-10",
          isPickup ? "bg-primary" : "bg-primary/60"
        )}>
          {isFirst ? (
            <CircleDot className="h-3 w-3 text-primary-foreground" />
          ) : isLast ? (
            <Navigation className="h-2.5 w-2.5 text-primary-foreground" />
          ) : (
            <Circle className="h-2 w-2 text-primary-foreground" />
          )}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 min-h-[24px] bg-border" />
        )}
      </div>

      {/* Conteudo */}
      <div className="flex-1 min-w-0 pb-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-medium text-primary tabular-nums">{stop.time}</span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {isPickup ? 'Embarque' : 'Desembarque'}
          </Badge>
        </div>
        <p className="text-sm font-medium text-foreground truncate">
          {stop.address}
        </p>
        <p className="text-xs text-muted-foreground">
          {stop.neighborhood}, {stop.city}
        </p>
        {stop.passenger ? (
          <div className="flex items-center gap-2 mt-1.5">
            <Avatar className="h-5 w-5">
              <AvatarImage src={stop.passenger.avatar} alt={stop.passenger.name} />
              <AvatarFallback className="text-[10px]">{stop.passenger.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{stop.passenger.name}</span>
          </div>
        ) : (isFirst || isLast) && (
          <div className="flex items-center gap-2 mt-1.5">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {isDriver ? 'Voce' : driverName} {isFirst ? '(Motorista)' : ''}
            </span>
          </div>
        )}
      </div>
    </button>
  )
}

// Componente para card de participante
interface ParticipantCardProps {
  participant: {
    id: string
    name: string
    avatar: string
    rating: number
    role: 'driver' | 'passenger'
    origin: string
    destination: string
    seatsBooked?: number
    status?: 'confirmed' | 'pending' | 'cancelled'
  }
  isCurrentUser: boolean
}

function ParticipantCard({ participant, isCurrentUser }: ParticipantCardProps) {
  const isDriver = participant.role === 'driver'
  
  return (
    <div className={cn(
      "flex items-start gap-3 p-3 rounded-xl mb-2",
      isCurrentUser ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
    )}>
      <Avatar className="h-10 w-10">
        <AvatarImage src={participant.avatar} alt={participant.name} />
        <AvatarFallback>{participant.name[0]}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm truncate">{participant.name}</span>
          {isCurrentUser && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">Voce</Badge>
          )}
          {isDriver && (
            <Badge className="text-[10px] px-1.5 py-0 bg-primary">Motorista</Badge>
          )}
          {participant.status === 'pending' && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-600">Pendente</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <span className="text-amber-500">★</span>
          <span>{participant.rating.toFixed(1)}</span>
          {participant.seatsBooked && participant.seatsBooked > 1 && (
            <>
              <span className="mx-1">•</span>
              <span>{participant.seatsBooked} lugares</span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
          <span className="truncate">{participant.origin}</span>
          <span className="mx-0.5">→</span>
          <span className="truncate">{participant.destination}</span>
        </div>
      </div>
    </div>
  )
}
