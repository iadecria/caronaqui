'use client'

import { useRides, usePopularRoutes } from '@/hooks/use-api'
import { RideCard } from '@/components/home/ride-card'
import { PopularRoutes } from '@/components/home/popular-routes'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { ArrowRightIcon } from 'lucide-react'

export function PublicRidesSection() {
  const { setShowLoginModal } = useAuth()
  const { data: rides = [] } = useRides()
  const { data: popularRoutes = [] } = usePopularRoutes()

  // Mostrar apenas 6 caronas na landing page
  const displayRides = rides.slice(0, 6)

  return (
    <section id="rotas-populares" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Popular Routes */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
                Rotas populares
              </h2>
              <p className="text-muted-foreground">
                As rotas mais procuradas da Via Dutra
              </p>
            </div>
          </div>
          <PopularRoutes routes={popularRoutes} />
        </div>

        {/* Available Rides */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
                Caronas disponiveis
              </h2>
              <p className="text-muted-foreground">
                Encontre sua proxima viagem
              </p>
            </div>
            <Button variant="ghost" className="hidden md:flex" onClick={() => setShowLoginModal(true)}>
              Ver todas
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {displayRides.map((ride) => (
              <RideCard 
                key={ride.id} 
                ride={ride} 
                requiresAuth
              />
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="mt-8 text-center md:hidden">
            <Button onClick={() => setShowLoginModal(true)} className="w-full">
              Ver todas as caronas
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
