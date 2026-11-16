'use client'

import { CalendarDays, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePublish } from '@/contexts/publish-context'
import { format, addDays, parseISO, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { PUBLISH } from '@/lib/identity'

// Gerar horarios de 00:00 ate 23:30
const timeSlots = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2)
  const minutes = i % 2 === 0 ? '00' : '30'
  return `${hours.toString().padStart(2, '0')}:${minutes}`
})

export function StepDateTime() {
  const { formData, updateFormData } = usePublish()

  const selectedDate = formData.date && isValid(parseISO(formData.date)) 
    ? parseISO(formData.date) 
    : undefined

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      updateFormData({ date: format(date, 'yyyy-MM-dd') })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <CalendarDays className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{PUBLISH.step3.title}</h2>
          <p className="text-sm text-muted-foreground">{PUBLISH.step3.subtitle}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calendar */}
        <div className="space-y-2">
          <Label>Data da viagem</Label>
          <div className="border border-border rounded-lg p-3 bg-card flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date() || date > addDays(new Date(), 60)}
              locale={ptBR}
              className="rounded-md"
            />
          </div>
          {selectedDate && (
            <p className="text-sm text-muted-foreground text-center">
              Selecionado: {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </p>
          )}
        </div>

        {/* Time selection */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="time">Horario de saida</Label>
            <Select
              value={formData.time}
              onValueChange={(value) => updateFormData({ time: value })}
            >
              <SelectTrigger id="time" className="w-full">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Selecione o horario" />
                </div>
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick time selection */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Horarios populares</Label>
            <div className="grid grid-cols-3 gap-2">
              {['05:00', '06:00', '07:00', '14:00', '16:00', '18:00'].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => updateFormData({ time })}
                  className={`py-2 px-3 text-sm rounded-lg border transition-colors ${
                    formData.time === time
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-border bg-card text-foreground hover:border-primary/50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          {formData.date && formData.time && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Sua viagem esta marcada para:</p>
              <p className="text-lg font-semibold text-foreground mt-1">
                {selectedDate && format(selectedDate, "d 'de' MMMM", { locale: ptBR })} as {formData.time}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
