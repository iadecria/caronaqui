'use client'

import { useState } from 'react'
import { DogIcon, Luggage, CigaretteOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Filter {
  id: string
  label: string
  icon: React.ReactNode
  description: string
}

interface QuickFiltersProps {
  onFilterChange?: (filters: string[]) => void
  /** Tags ativas controladas externamente (opcional) */
  value?: string[]
  /** Variante compacta para uso acima da lista de resultados */
  variant?: 'default' | 'compact'
}

// IDs alinhados com selectedComforts em SearchResults (pets, luggage, noSmoking)
const QUICK_FILTERS: Filter[] = [
  {
    id: 'pets',
    label: 'Aceita Pets',
    icon: <DogIcon className="h-4 w-4" />,
    description: 'Viagens com pets permitidos',
  },
  {
    id: 'luggage',
    label: 'Bagagem',
    icon: <Luggage className="h-4 w-4" />,
    description: 'Espaço para bagagem',
  },
  {
    id: 'noSmoking',
    label: 'Não fumante',
    icon: <CigaretteOff className="h-4 w-4" />,
    description: 'Carona sem cigarro',
  },
]

export function QuickFilters({ onFilterChange, value, variant = 'default' }: QuickFiltersProps) {
  const [internalFilters, setInternalFilters] = useState<Set<string>>(new Set())

  // Modo controlado usa `value`, senão usa estado interno
  const activeFilters = value !== undefined ? new Set(value) : internalFilters

  const toggleFilter = (filterId: string) => {
    const newFilters = new Set(activeFilters)
    if (newFilters.has(filterId)) {
      newFilters.delete(filterId)
    } else {
      newFilters.add(filterId)
    }
    if (value === undefined) {
      setInternalFilters(newFilters)
    }
    onFilterChange?.(Array.from(newFilters))
  }

  const isCompact = variant === 'compact'

  return (
    <div className={cn(isCompact ? 'w-full' : 'px-4 pb-6 md:px-6')}>
      <div className={cn(isCompact ? 'space-y-0' : 'space-y-3')}>
        {!isCompact && (
          <p className="text-sm font-semibold text-foreground">Filtrar por características</p>
        )}
        {/* Scroll horizontal dos filtros */}
        <div className={cn(
          'flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory',
          isCompact
            ? '-mx-4 px-4'
            : '-mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible'
        )}>
          {QUICK_FILTERS.map((filter) => {
            const isActive = activeFilters.has(filter.id)
            
            return (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 flex-shrink-0 md:flex-shrink whitespace-nowrap md:whitespace-normal border',
                  'snap-start',
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 active:scale-95'
                )}
                title={filter.description}
              >
                {filter.icon}
                <span>{filter.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
