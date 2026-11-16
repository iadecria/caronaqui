'use client'

import * as React from 'react'
import { format, isToday, isTomorrow, addDays, startOfToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'

interface DatePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  className?: string
  variant?: 'default' | 'minimal'
  compact?: boolean
}

// Atalhos de datas rapidas
const quickDates = [
  { label: 'Hoje', getValue: () => startOfToday() },
  { label: 'Amanha', getValue: () => addDays(startOfToday(), 1) },
  { label: 'Sexta', getValue: () => getNextWeekday(5) },
  { label: 'Sabado', getValue: () => getNextWeekday(6) },
  { label: 'Domingo', getValue: () => getNextWeekday(0) },
]

function getNextWeekday(targetDay: number): Date {
  const today = startOfToday()
  const currentDay = today.getDay()
  let daysUntil = targetDay - currentDay
  if (daysUntil <= 0) daysUntil += 7
  return addDays(today, daysUntil)
}

function formatDateDisplay(date: Date): string {
  if (isToday(date)) {
    return `Hoje, ${format(date, 'd MMM', { locale: ptBR })}`
  }
  if (isTomorrow(date)) {
    return `Amanha, ${format(date, 'd MMM', { locale: ptBR })}`
  }
  return format(date, "EEE, d 'de' MMM", { locale: ptBR })
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Quando e a viagem?',
  minDate,
  maxDate,
  className,
  variant = 'default',
  compact = false,
}: DatePickerProps) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const isMinimal = variant === 'minimal' || compact

  const handleSelect = (date: Date | undefined) => {
    onChange(date)
    if (date) {
      setOpen(false)
    }
  }

  const handleQuickDate = (getValue: () => Date) => {
    const date = getValue()
    onChange(date)
    setOpen(false)
  }

  const calendarContent = (
    <div className="flex flex-col">
      {/* Atalhos rapidos */}
      <div className="flex flex-wrap gap-1.5 p-3 border-b border-border">
        {quickDates.map((quick) => {
          const quickDate = quick.getValue()
          const isSelected = value && format(value, 'yyyy-MM-dd') === format(quickDate, 'yyyy-MM-dd')
          return (
            <button
              key={quick.label}
              onClick={() => handleQuickDate(quick.getValue)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full transition-colors touch-target",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 active:bg-primary/10"
              )}
            >
              {quick.label}
            </button>
          )
        })}
      </div>

      {/* Calendario */}
      <div className="p-2">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          disabled={(date) => {
            const today = startOfToday()
            if (date < today) return true
            if (minDate && date < minDate) return true
            if (maxDate && date > maxDate) return true
            return false
          }}
          initialFocus
        />
      </div>

      {/* Limpar selecao */}
      {value && (
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={() => handleSelect(undefined)}
          >
            <X className="h-4 w-4 mr-2" />
            Limpar data
          </Button>
        </div>
      )}
    </div>
  )

  const triggerButton = isMinimal ? (
    <button
      className={cn(
        "flex items-center gap-3 text-sm text-left w-full",
        value ? "text-foreground" : "text-muted-foreground",
        className
      )}
    >
      <CalendarIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      <span className="truncate">
        {value ? formatDateDisplay(value) : placeholder}
      </span>
    </button>
  ) : (
    <button
      className={cn(
        "w-full flex items-center gap-2 px-3 py-3 bg-muted rounded-xl text-sm h-11 md:h-12",
        "text-left transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        "active:bg-muted/80",
        value ? "text-foreground" : "text-muted-foreground",
        className
      )}
    >
      <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <span className="truncate">
        {value ? formatDateDisplay(value) : placeholder}
      </span>
    </button>
  )

  // Mobile: usar Drawer
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          {triggerButton}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="border-b border-border">
            <DrawerTitle className="text-center">Selecione a data</DrawerTitle>
          </DrawerHeader>
          {calendarContent}
          <div className="p-4 safe-area-inset-bottom">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  // Desktop: usar Popover
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {triggerButton}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {calendarContent}
      </PopoverContent>
    </Popover>
  )
}
