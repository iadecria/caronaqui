'use client'

import { Star, Shield, Car, Heart, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Driver } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AchievementsGrid, MOCK_ACHIEVEMENTS } from '@/components/achievements/achievements-grid'
import { useState } from 'react'
import { useFavoriteDrivers } from '@/contexts/favorite-drivers-context'
import { useAuth } from '@/contexts/auth-context'
import { useNotifications } from '@/contexts/notifications-context'
import { cn } from '@/lib/utils'

interface DriverInfoProps {
  driver: Driver
  carModel?: string
  carColor?: string
}

export function DriverInfo({ driver, carModel, carColor }: DriverInfoProps) {
  const { toggleFavoriteDriver, isFavoriteDriver } = useFavoriteDrivers()
  const { isLoggedIn } = useAuth()
  const { addNotification } = useNotifications()
  const isFavorite = isFavoriteDriver(driver.id)

  const handleToggleFavorite = () => {
    if (!isLoggedIn) {
      addNotification({
        type: 'info',
        title: 'Faça login',
        description: 'Você precisa estar logado para favoritar motoristas.',
      })
      return
    }
    toggleFavoriteDriver(driver.id)
  }
  const memberSinceDate = new Date(driver.memberSince)
  const formattedMemberSince = memberSinceDate.toLocaleDateString('pt-BR', {
    month: 'short',
    year: 'numeric',
  })

  const [expandedAchievement, setExpandedAchievement] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      {/* Info do motorista + botão favoritar */}
      <div className="bg-card rounded-xl border border-border p-4 space-y-3">
        {/* Avatar + nome + nota + favoritar */}
        <div className="flex items-start gap-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-border">
            <Image
              src={driver.avatar}
              alt={`Foto de ${driver.name}`}
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
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            className="flex-shrink-0"
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

        {/* Separador + estatisticas */}
        <div className="border-t border-border pt-4 space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Membro desde</span>
            <span className="font-medium">{formattedMemberSince}</span>
          </div>
          {(carModel || carColor) && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Car className="h-3.5 w-3.5" />
                Veiculo
              </span>
              <span className="font-medium truncate max-w-[140px]">
                {[carModel, carColor].filter(Boolean).join(' · ')}
              </span>
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 pt-1">
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

          {/* Botão Ver Perfil Completo */}
          <Link href={`/dashboard/motorista/${driver.id}`}>
            <Button variant="outline" className="w-full justify-between">
              <span>Ver perfil completo e caronas</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Conquistas do motorista */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Conquistas</h3>
        <AchievementsGrid
          achievements={MOCK_ACHIEVEMENTS}
          variant="compact"
          maxDisplay={3}
          onAchievementClick={(achievement) => setExpandedAchievement(achievement.id)}
        />
      </div>

      {/* Tooltip/detalhe de conquista */}
      {expandedAchievement && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
          {(() => {
            const achievement = MOCK_ACHIEVEMENTS.find(a => a.id === expandedAchievement)
            return achievement ? (
              <div className="flex gap-3">
                <div className="text-2xl flex-shrink-0">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-amber-950">{achievement.name}</h4>
                  <p className="text-xs text-amber-900 mt-1">{achievement.description}</p>
                  {achievement.unlocked && (
                    <p className="text-xs text-amber-700 mt-2 font-semibold">
                      ✓ Desbloqueado em {new Date(achievement.unlockedDate!).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
            ) : null
          })()}
        </div>
      )}
    </div>
  )
}
