'use client'

import { useRouter } from 'next/navigation'
import { Heart, ChevronRight, Star } from 'lucide-react'
import Image from 'next/image'
import { useFavorites } from '@/contexts/favorites-context'
import { useFavoriteDrivers } from '@/contexts/favorite-drivers-context'
import { useAuth } from '@/contexts/auth-context'
import { RidesList } from '@/components/home/rides-list'
import { mockRides } from '@/lib/mock-data'
import { Empty } from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { FAVORITES, LABELS } from '@/lib/identity'
import { cn } from '@/lib/utils'

export default function FavoritesPage() {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const { favorites } = useFavorites()
  const { favoriteDriverIds, removeFavoriteDriver } = useFavoriteDrivers()

  const favoriteRides = mockRides.filter(ride => favorites.includes(ride.id))
  
  // Extrair motoristas únicos favoritados de todas as caronas
  const favoritedDriversSet = new Map<string, any>()
  favoriteRides.forEach(ride => {
    if (!favoritedDriversSet.has(ride.driver.id)) {
      favoritedDriversSet.set(ride.driver.id, ride.driver)
    }
  })
  
  const favoritedDrivers = Array.from(favoritedDriversSet.values()).filter(driver =>
    favoriteDriverIds.includes(driver.id)
  )

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
          <h1 className="text-xl font-semibold">Faça login para ver seus favoritos</h1>
          <p className="text-muted-foreground text-sm">
            Você precisa estar autenticado para visualizar e gerenciar seus favoritos.
          </p>
          <Button onClick={() => router.push('/login')} className="w-full">
            Fazer Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 md:px-6 md:py-6 space-y-6 md:space-y-8 max-w-4xl mx-auto pb-20">
      {/* Seção de Caronas Favoritas */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground">Caronas Favoritas</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {favoriteRides.length} carona{favoriteRides.length !== 1 ? 's' : ''} salva{favoriteRides.length !== 1 ? 's' : ''}
          </p>
        </div>

        {favoriteRides.length > 0 ? (
          <RidesList rides={favoriteRides} />
        ) : (
          <Empty
            icon={<Heart className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />}
            title="Nenhuma carona favorita"
            description="Clique no coração das caronas que você curtir para encontrá-las depois."
            action={{
              label: LABELS.searchRide,
              href: "/dashboard/buscar"
            }}
          />
        )}
      </div>

      {/* Seção de Motoristas Favoritos */}
      <div className="space-y-4 border-t border-border pt-6">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground">Motoristas Favoritos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {favoritedDrivers.length} motorista{favoritedDrivers.length !== 1 ? 's' : ''} salvo{favoritedDrivers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {favoritedDrivers.length > 0 ? (
          <div className="space-y-3">
            {favoritedDrivers.map(driver => (
              <div
                key={driver.id}
                className="bg-card rounded-xl border border-border p-4 space-y-3 hover:border-primary/50 transition-colors"
              >
                {/* Info do motorista */}
                <div className="flex items-start gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/50">
                    <Image
                      src={driver.avatar}
                      alt={driver.name}
                      fill
                      className="object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base truncate">{driver.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 text-sm font-medium">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {driver.rating}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {driver.totalRides} viagens
                      </span>
                    </div>
                  </div>

                  {/* Botão remover favorito */}
                  <button
                    onClick={() => removeFavoriteDriver(driver.id)}
                    className="flex-shrink-0 p-2 hover:bg-primary/10 rounded-lg transition-colors"
                    title="Remover dos favoritos"
                  >
                    <Heart className="h-5 w-5 fill-primary text-primary" />
                  </button>
                </div>

                {/* Veículo + Membro */}
                <div className="flex gap-3 text-sm text-muted-foreground px-1">
                  {driver.vehicle && (
                    <span className="truncate">
                      <span className="font-medium text-foreground">{driver.vehicle.model}</span>
                    </span>
                  )}
                  {driver.memberSince && (
                    <span>
                      Membro desde{' '}
                      <span className="font-medium text-foreground">
                        {new Date(driver.memberSince).toLocaleDateString('pt-BR', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </span>
                  )}
                </div>

                {/* Botão Ver Perfil */}
                <button
                  onClick={() => router.push(`/dashboard/motorista/${driver.id}`)}
                  className={cn(
                    'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg',
                    'bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm font-medium'
                  )}
                >
                  <span>Ver perfil e caronas</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <Empty
            icon={<Heart className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />}
            title="Nenhum motorista favorito"
            description="Explore caronas e favorite motoristas que você gosta para acompanhá-los!"
            action={{
              label: "Explorar Caronas",
              href: "/dashboard"
            }}
          />
        )}
      </div>
    </div>
  )
}
