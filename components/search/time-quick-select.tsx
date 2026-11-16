'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimeQuickSelectProps {
  selectedTime?: string
  onTimeSelect: (time: string | undefined) => void
  className?: string
}

const QUICK_TIME_SLOTS = [
  { label: '00h+', time: '00:00', description: 'Madrugada' },
  { label: '06h+', time: '06:00', description: 'Cedo' },
  { label: '12h+', time: '12:00', description: 'Meio-dia' },
  { label: '18h+', time: '18:00', description: 'Noite' },
]

export function TimeQuickSelect({ selectedTime, onTimeSelect, className }: TimeQuickSelectProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <Label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Quando você sai?
      </Label>
      
      <div className="grid grid-cols-4 gap-2">
        {QUICK_TIME_SLOTS.map((slot) => (
          <button
            key={slot.time}
            onClick={() => onTimeSelect(selectedTime === slot.time ? undefined : slot.time)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg',
              'border-2 transition-all duration-200 text-sm font-medium',
              selectedTime === slot.time
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-card border-border text-foreground hover:border-primary/50'
            )}
          >
            <span className="text-base font-bold">{slot.label}</span>
            <span className="text-xs text-muted-foreground">{slot.description}</span>
          </button>
        ))}
      </div>
      
      {selectedTime && (
        <button
          onClick={() => onTimeSelect(undefined)}
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          Limpar horário
        </button>
      )}
    </div>
  )
}
