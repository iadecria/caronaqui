"use client"

import * as React from "react"
import { Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value?: string // formato "HH:mm"
  onChange: (time: string | undefined) => void
  placeholder?: string
  className?: string
  variant?: 'default' | 'minimal'
  compact?: boolean
}



function parseTime(time: string): { hour: number; minute: number } | null {
  const match = time.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return null
  return { hour: parseInt(match[1]), minute: parseInt(match[2]) }
}

function formatDisplayTime(time: string): string {
  const parsed = parseTime(time)
  if (!parsed) return time
  return `${parsed.hour}h${parsed.minute.toString().padStart(2, '0')}`
}

export function TimePicker({
  value,
  onChange,
  placeholder = "Horario",
  className,
  variant = 'default',
  compact = false,
}: TimePickerProps) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)

  const isMinimal = variant === 'minimal' || compact



  const handleClear = () => {
    onChange(undefined)
    setOpen(false)
  }

  const triggerButton = isMinimal ? (
    <button
      className={cn(
        "flex items-center gap-3 text-sm text-left w-full",
        value ? "text-foreground" : "text-muted-foreground",
        className
      )}
    >
      <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      <span className="truncate">
        {value ? formatDisplayTime(value) : placeholder}
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
      <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <span className="truncate">
        {value ? formatDisplayTime(value) : placeholder}
      </span>
    </button>
  )

  const timePickerContent = (
    <div className="space-y-6">
      {/* Botoes rapidos */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Horarios populares</p>
        <div className="grid grid-cols-3 gap-2">
          {['06:00', '08:00', '12:00', '14:00', '18:00', '20:00'].map((time) => (
            <Button
              key={time}
              variant={value === time ? "default" : "outline"}
              size="sm"
              onClick={() => {
                onChange(time)
                setOpen(false)
              }}
              className="text-xs"
            >
              {formatDisplayTime(time)}
            </Button>
          ))}
        </div>
      </div>



      {/* Botao limpar */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleClear}
        className="w-full"
      >
        <X className="h-4 w-4 mr-2" />
        Limpar
      </Button>
    </div>
  )

  if (isMobile) {
    return (
      <>
        <div onClick={() => setOpen(true)} className="w-full">
          {triggerButton}
        </div>

        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Selecione o horario</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-6">
              {timePickerContent}
            </div>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {triggerButton}
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-6" align="start">
        {timePickerContent}
      </PopoverContent>
    </Popover>
  )
}

/**
 * Calcula a janela de busca baseada no horario selecionado
 */
export function calculateTimeWindow(
  selectedTime: string,
  windowHours: number = 2
): { start: string; end: string; adjusted: boolean } {
  const parsed = parseTime(selectedTime)
  if (!parsed) {
    return { start: '00:00', end: '23:59', adjusted: false }
  }

  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  // Horario selecionado em minutos desde meia-noite
  const selectedMinutes = parsed.hour * 60 + parsed.minute

  // Janela inicial: selectedTime - windowHours
  let startMinutes = selectedMinutes - (windowHours * 60)

  // Janela final: selectedTime + windowHours
  let endMinutes = selectedMinutes + (windowHours * 60)

  // Ajusta se o inicio da janela ja passou
  const currentMinutes = currentHour * 60 + currentMinute
  let adjusted = false

  if (startMinutes < currentMinutes) {
    startMinutes = currentMinutes
    adjusted = true
  }

  // Garante limites validos
  startMinutes = Math.max(0, startMinutes)
  endMinutes = Math.min(23 * 60 + 59, endMinutes)

  const startHour = Math.floor(startMinutes / 60)
  const startMin = startMinutes % 60
  const endHour = Math.floor(endMinutes / 60)
  const endMin = endMinutes % 60

  return {
    start: `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`,
    end: `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`,
    adjusted
  }
}
