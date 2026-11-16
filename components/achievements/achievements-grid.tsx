'use client'

import { Trophy } from 'lucide-react'
import React from 'react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  badgeColor?: string
  badgeBgColor?: string
  colorScheme?: 'primary' | 'slate' // Novo: esquema de cores simplificado
  unlocked: boolean
  unlockedDate?: string
  progress?: {
    current: number
    total: number
  }
}

interface AchievementsGridProps {
  achievements: Achievement[]
  variant?: 'compact' | 'detailed'
  maxDisplay?: number
  onAchievementClick?: (achievement: Achievement) => void
}

export function AchievementsGrid({
  achievements,
  variant = 'compact',
  maxDisplay = 4,
}: AchievementsGridProps) {
  const [selectedAchievement, setSelectedAchievement] = React.useState<Achievement | null>(null)
  const displayedAchievements = achievements.slice(0, maxDisplay)
  const hiddenCount = Math.max(0, achievements.length - maxDisplay)
  const unlockedCount = achievements.filter(a => a.unlocked).length

  if (variant === 'compact') {
    return (
      <>
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">
              Conquistas ({unlockedCount}/{achievements.length})
            </span>
          </div>
          
          {/* Layout com selos/insígnias - apenas ícones, texto no hover */}
          <div className="flex flex-wrap items-center gap-3">
            {displayedAchievements.map((achievement) => (
              <div key={achievement.id} className="group relative">
                {/* Selo/Insígnia */}
                <button
                  onClick={() => setSelectedAchievement(achievement)}
                  className={cn(
                    'relative h-14 w-14 rounded-full flex items-center justify-center text-3xl transition-all duration-200',
                    'border-2 shadow-md',
                    achievement.unlocked
                      ? 'cursor-pointer hover:scale-110 hover:shadow-lg hover:ring-2'
                      : 'cursor-default opacity-40',
                  )}
                  style={achievement.unlocked ? (
                    achievement.colorScheme === 'primary' 
                      ? {
                          backgroundColor: 'rgba(80, 200, 120, 0.1)',
                          borderColor: '#50C878',
                          filter: 'grayscale(0.95) brightness(1.1)',
                        }
                      : {
                          backgroundColor: 'rgba(100, 116, 139, 0.15)',
                          borderColor: '#64748b',
                          filter: 'grayscale(1)',
                        }
                  ) : {
                    backgroundColor: '#27272a',
                    borderColor: '#52525b',
                    filter: 'grayscale(1)',
                  }}
                >
                  {achievement.icon}
                </button>
                
                {/* Tooltip com nome e descrição ao hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-200 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 shadow-lg">
                  <div className="font-semibold">{achievement.name}</div>
                  <div className="text-zinc-400 text-xs mt-0.5">{achievement.description}</div>
                </div>
              </div>
            ))}

            {hiddenCount > 0 && (
              <button
                onClick={() => setSelectedAchievement(displayedAchievements[0])}
                className="h-14 w-14 rounded-full border-2 border-dashed border-zinc-600 text-sm font-bold text-zinc-400 hover:border-primary/50 hover:text-primary/80 hover:bg-primary/5 transition-all flex items-center justify-center"
              >
                +{hiddenCount}
              </button>
            )}
          </div>
        </div>

        {/* Modal com detalhes completos */}
        <Dialog open={!!selectedAchievement} onOpenChange={(open) => !open && setSelectedAchievement(null)}>
          <DialogContent className="max-w-sm border-zinc-800 bg-zinc-900">
            {selectedAchievement && (
              <>
                <DialogHeader>
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{selectedAchievement.icon}</div>
                    <div className="flex-1">
                      <DialogTitle className="text-base">{selectedAchievement.name}</DialogTitle>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Descrição */}
                  <div>
                    <p className="text-sm text-zinc-300">{selectedAchievement.description}</p>
                  </div>

                  {/* Progresso se existir */}
                  {selectedAchievement.progress && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-200">
                          {selectedAchievement.progress.current}/{selectedAchievement.progress.total}
                        </span>
                        <span className="text-zinc-400">
                          {Math.round((selectedAchievement.progress.current / selectedAchievement.progress.total) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${Math.round((selectedAchievement.progress.current / selectedAchievement.progress.total) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Data de desbloqueio */}
                  {selectedAchievement.unlocked && selectedAchievement.unlockedDate && (
                    <div className="text-xs text-zinc-400">
                      ✓ Desbloqueado em {new Date(selectedAchievement.unlockedDate).toLocaleDateString('pt-BR')}
                    </div>
                  )}

                  {!selectedAchievement.unlocked && (
                    <div className="text-xs text-zinc-400">
                      🔒 Bloqueado - Continue trabalhando para desbloquear
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Variant: detailed
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <Trophy className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">
          Todas as Conquistas ({unlockedCount}/{achievements.length})
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="group relative">
            <button
              onClick={() => setSelectedAchievement(achievement)}
              className={cn(
                'w-full flex flex-col items-center gap-3 p-4 rounded-xl transition-all',
                achievement.unlocked
                  ? 'cursor-pointer hover:scale-110 hover:shadow-lg'
                  : 'cursor-default opacity-40 grayscale'
              )}
              style={{
                backgroundColor: achievement.unlocked ? `${achievement.badgeBgColor}20` : 'transparent',
              }}
            >
              {/* Ícone Grande */}
              <div className="text-5xl transition-transform group-hover:scale-110">
                {achievement.icon}
              </div>
              
              {/* Invisível por padrão, visível no hover */}
              <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                <h4 className={cn(
                  'font-semibold text-sm',
                  achievement.unlocked ? achievement.badgeColor : 'text-zinc-500'
                )}>
                  {achievement.name}
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  {achievement.description}
                </p>
              </div>
            </button>

            {/* Progresso em barra se existir e não desbloqueado */}
            {achievement.progress && !achievement.unlocked && (
              <div className="mt-2 px-2">
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${Math.round((achievement.progress.current / achievement.progress.total) * 100)}%`
                    }}
                  />
                </div>
                <p className="text-xs text-zinc-500 text-center mt-1">
                  {achievement.progress.current}/{achievement.progress.total}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Mock achievements data com paleta padrão minimalista
import { ACHIEVEMENT_EMOJIS } from '@/lib/achievements-emojis'

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ponta-firme',
    name: 'Ponta Firme',
    description: 'Complete 10 viagens sem cancelamentos',
    icon: ACHIEVEMENT_EMOJIS.viagem.ponta_firme.emoji,
    colorScheme: 'slate',
    unlocked: true,
    unlockedDate: '2024-03-15',
  },
  {
    id: 'motorista-confiavel',
    name: 'Motorista Confiável',
    description: 'Mantenha rating acima de 4.8',
    icon: ACHIEVEMENT_EMOJIS.motorista.confiavel.emoji,
    colorScheme: 'primary',
    unlocked: true,
    unlockedDate: '2024-02-20',
  },
  {
    id: 'economia-verde',
    name: 'Economia Verde',
    description: 'Economize R$ 500 em caronas compartilhadas',
    icon: ACHIEVEMENT_EMOJIS.passageiro.economia_verde.emoji,
    colorScheme: 'primary',
    unlocked: true,
    unlockedDate: '2024-03-01',
    progress: { current: 500, total: 500 },
  },
  {
    id: 'explorador-dutra',
    name: 'Explorador da Dutra',
    description: 'Viaje para 10 cidades diferentes',
    icon: ACHIEVEMENT_EMOJIS.viagem.explorador.emoji,
    colorScheme: 'slate',
    unlocked: false,
    progress: { current: 7, total: 10 },
  },
  {
    id: 'madrugador',
    name: 'Madrugador',
    description: 'Complete uma viagem entre 00:00 e 06:00',
    icon: ACHIEVEMENT_EMOJIS.viagem.madrugador.emoji,
    colorScheme: 'slate',
    unlocked: false,
  },
  {
    id: 'super-host',
    name: 'Super Host',
    description: 'Hospede 50 passageiros com sucesso',
    icon: ACHIEVEMENT_EMOJIS.motorista.super_host.emoji,
    colorScheme: 'slate',
    unlocked: false,
    progress: { current: 23, total: 50 },
  },
  {
    id: 'amigo-da-natureza',
    name: 'Amigo da Natureza',
    description: 'Complete 20 viagens eco-friendly',
    icon: ACHIEVEMENT_EMOJIS.passageiro.reciclador.emoji,
    colorScheme: 'slate',
    unlocked: false,
    progress: { current: 0, total: 20 },
  },
  {
    id: 'veterano',
    name: 'Veterano',
    description: 'Complete 100 viagens',
    icon: ACHIEVEMENT_EMOJIS.comunidade.veterano.emoji,
    colorScheme: 'slate',
    unlocked: false,
    progress: { current: 47, total: 100 },
  },
]
