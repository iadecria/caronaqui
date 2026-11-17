'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Star, Shield, Heart, Check } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { AchievementsGrid, MOCK_ACHIEVEMENTS } from '@/components/achievements/achievements-grid'
import { useFavoriteDrivers } from '@/contexts/favorite-drivers-context'
import { cn } from '@/lib/utils'
import { mockRides, mockDrivers, type Driver, type Ride } from '@/lib/mock-data'
import { useNotifications } from '@/contexts/notifications-context'

export default function DriverProfilePage() {
  const params = useParams()
  const router = useRouter()
  const driverId = params.id as string
  
  const [selectedRides, setSelectedRides] = useState<Set<string>>(new Set())
  const { toggleFavoriteDriver, isFavoriteDriver } = useFavoriteDrivers()
  const { addNotification } = useNotifications()
  const isFavorite = isFavoriteDriver(driverId)

  // Caronas mockadas (modo demo)
  const allRides: Ride[] = mockRides
  
  // Encontrar todas as caronas do motorista
  const driverRides = allRides.filter(ride => ride.driver.id === driverId)
  
  // Dados do motorista: carona, lista de motoristas ou fallback
  const driver: Driver = driverRides[0]?.driver ||
    mockDrivers.find(d => d.id === driverId) || {
    id: driverId,
    name: 'Motorista',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
    rating: 0,
    totalRides: 0,
    memberSince: new Date().toISOString(),
    verifiedPhone: false,
    verifiedId: false,
  }

  const memberSinceDate = new Date(driver.memberSince)
  const formattedMemberSince = memberSinceDate.toLocaleDateString('pt-BR', {
    month: 'short',
    year: 'numeric',
  })

  const toggleRideSelection = (rideId: string) => {
    const newSelected = new Set(selectedRides)
    if (newSelected.has(rideId)) {
      newSelected.delete(rideId)
    } else {
      newSelected.add(rideId)
    }
    setSelectedRides(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedRides.size === driverRides.length) {
      setSelectedRides(new Set())
    } else {
      setSelectedRides(new Set(driverRides.map(r => r.id)))
    }
  }

  const handleSolicitarSelecionadas = () => {
    if (selectedRides.size === 0) return
    
    // Aqui você pode implementar a lógica para solicitar as caronas selecionadas
    addNotification({
      type: 'reservation',
      title: 'Solicitação enviada',
      message: `Você solicitou ${selectedRides.size} carona(s) de ${driver.name}.`,
      actionUrl: '/dashboard/minhas-reservas',
    })
    setSelectedRides(new Set())
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header com voltar */}
      <div className="sticky top-0 bg-background border-b border-border p-4 z-10 flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="text-primary hover:text-primary/80 transition-colors p-2 -ml-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold flex-1 text-center">Motorista</h1>
        <div className="w-5" />
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Card do motorista */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-5">
          {/* Avatar + info principal */}
          <div className="flex gap-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-border">
              <Image
                src={driver.avatar}
                alt={driver.name}
                fill
                className="object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-lg">{driver.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-sm font-medium">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {driver.rating}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {driver.totalRides} viagens
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavoriteDriver(driver.id)}
                >
                  <Heart
                    className={cn(
                      'h-5 w-5 transition-colors',
                      isFavorite
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground hover:text-primary'
                    )}
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* Informações */}
          <div className="border-t border-border pt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Membro desde</span>
              <span className="font-medium">{formattedMemberSince}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {driver.verifiedPhone && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <Shield className="h-3 w-3" />
                  Telefone verificado
                </Badge>
              )}
              {driver.verifiedId && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <Shield className="h-3 w-3" />
                  Identidade verificada
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Conquistas */}
        {MOCK_ACHIEVEMENTS.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-6">
            <AchievementsGrid
              achievements={MOCK_ACHIEVEMENTS}
              variant="compact"
              maxDisplay={8}
            />
          </div>
        )}

        {/* Caronas do motorista */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-semibold text-sm">
              Caronas disponíveis ({driverRides.length})
            </h3>
            {driverRides.length > 0 && (
              <button
                onClick={toggleSelectAll}
                className="text-xs text-primary hover:underline font-medium"
              >
                {selectedRides.size === driverRides.length
                  ? 'Desselecionar tudo'
                  : 'Selecionar tudo'}
              </button>
            )}
          </div>

          {driverRides.length > 0 ? (
            <div className="space-y-3">
              {driverRides.map(ride => (
                <div
                  key={ride.id}
                  className={cn(
                    'bg-card rounded-xl border p-4 space-y-3 transition-all cursor-pointer',
                    selectedRides.has(ride.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                  onClick={() => toggleRideSelection(ride.id)}
                >
                  {/* Checkbox + Conteúdo */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 pt-1">
                      <div className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                        selectedRides.has(ride.id)
                          ? 'bg-primary border-primary'
                          : 'border-border hover:border-primary/50'
                      )}>
                        {selectedRides.has(ride.id) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Rotas */}
                    <div className="space-y-2 flex-1">
                    <div className="flex items-start gap-2">
                      <div className="relative w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {ride.origin.city}, {ride.origin.state}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {ride.origin.neighborhood}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 ml-1">
                      <div className="text-xs text-muted-foreground mt-1">↓</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {Math.round(
                            new Date(`${ride.date}T${ride.time}:00`).getTime() - new Date().getTime()
                          ) > 0
                            ? 'Saída em '
                            : 'Saída em '}
                          {new Date(`${ride.date}T${ride.time}:00`).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="relative w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {ride.destination.city}, {ride.destination.state}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {ride.destination.neighborhood}
                        </p>
                      </div>
                    </div>
                  </div>

                    {/* Preço + vagas */}
                    <div className="border-t border-border pt-3 flex items-center justify-between text-sm">
                      <span className="font-semibold text-primary">
                        R$ {ride.price}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {ride.availableSeats} lugar{ride.availableSeats !== 1 ? 'es' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Nenhuma carona disponível no momento
            </div>
          )}
        </div>
      </div>

      {/* Footer com botão de solicitar */}
      {driverRides.length > 0 && selectedRides.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 space-y-3">
          <div className="text-sm text-muted-foreground">
            {selectedRides.size} carona{selectedRides.size !== 1 ? 's' : ''} selecionada{selectedRides.size !== 1 ? 's' : ''}
          </div>
          <Button
            onClick={handleSolicitarSelecionadas}
            size="lg"
            className="w-full"
          >
            <Check className="w-4 h-4 mr-2" />
            Solicitar {selectedRides.size} carona{selectedRides.size !== 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </div>
  )
}
