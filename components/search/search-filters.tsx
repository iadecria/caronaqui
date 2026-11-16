'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  PawPrint, 
  Luggage, 
  Cigarette,
  RotateCcw,
  Users
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchFiltersState {
  priceRange: [number, number]
  date: Date | undefined
  timeOfDay: 'any' | 'morning' | 'afternoon' | 'evening'
  allowsPets: boolean | null
  allowsLuggage: boolean | null
  noSmoking: boolean | null
  minSeats: number
}

interface SearchFiltersProps {
  filters: SearchFiltersState
  onFiltersChange: (filters: SearchFiltersState) => void
  onApply?: () => void
  className?: string
}

const defaultFilters: SearchFiltersState = {
  priceRange: [0, 200],
  date: undefined,
  timeOfDay: 'any',
  allowsPets: null,
  allowsLuggage: null,
  noSmoking: null,
  minSeats: 1
}

export function SearchFilters({ filters, onFiltersChange, onApply, className }: SearchFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchFiltersState>(filters)

  const updateFilter = <K extends keyof SearchFiltersState>(key: K, value: SearchFiltersState[K]) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const resetFilters = () => {
    setLocalFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  // Conta filtros ativos
  const activeFiltersCount = [
    localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 200,
    localFilters.allowsPets === true,
    localFilters.allowsLuggage === true,
    localFilters.noSmoking === true,
    localFilters.minSeats > 1
  ].filter(Boolean).length

  return (
    <div className={cn("space-y-6", className)}>
      {/* Faixa de Preco */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Faixa de Preco</Label>
        <Slider
          value={localFilters.priceRange}
          onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
          min={0}
          max={200}
          step={5}
          className="w-full"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="font-mono tabular-nums">R$ {localFilters.priceRange[0]}</span>
          <span className="font-mono tabular-nums">R$ {localFilters.priceRange[1]}</span>
        </div>
      </div>

      {/* Vagas minimas */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Users className="h-4 w-4" />
          Vagas minimas
        </Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((seats) => (
            <Button
              key={seats}
              variant={localFilters.minSeats === seats ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('minSeats', seats)}
              className="flex-1 h-10"
            >
              {seats}+
            </Button>
          ))}
        </div>
      </div>

      {/* Preferencias */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-foreground">Preferencias</Label>
        
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <PawPrint className="h-4 w-4 text-amber-500" />
            </div>
            <span className="text-sm text-foreground">Aceita pets</span>
          </div>
          <Switch
            checked={localFilters.allowsPets === true}
            onCheckedChange={(checked) => updateFilter('allowsPets', checked ? true : null)}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Luggage className="h-4 w-4 text-blue-500" />
            </div>
            <span className="text-sm text-foreground">Aceita bagagem grande</span>
          </div>
          <Switch
            checked={localFilters.allowsLuggage === true}
            onCheckedChange={(checked) => updateFilter('allowsLuggage', checked ? true : null)}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Cigarette className="h-4 w-4 text-red-500" />
            </div>
            <span className="text-sm text-foreground">Nao fumante</span>
          </div>
          <Switch
            checked={localFilters.noSmoking === true}
            onCheckedChange={(checked) => updateFilter('noSmoking', checked ? true : null)}
          />
        </div>
      </div>

      {/* Acoes */}
      <div className="flex gap-3 pt-4 border-t border-border/50">
        <Button
          variant="outline"
          onClick={resetFilters}
          className="flex-1 h-11"
          disabled={activeFiltersCount === 0}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Limpar {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Button>
        {onApply && (
          <Button
            onClick={onApply}
            className="flex-1 h-11"
          >
            Aplicar
          </Button>
        )}
      </div>
    </div>
  )
}

export { defaultFilters }
