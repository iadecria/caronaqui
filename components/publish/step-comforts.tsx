'use client'

import { Settings2, PawPrint, Cigarette, Luggage, MessageSquare } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { usePublish } from '@/contexts/publish-context'
import { cn } from '@/lib/utils'
import { PUBLISH } from '@/lib/identity'

const comfortOptions = [
  {
    key: 'allowsPets',
    icon: PawPrint,
    title: 'Aceita pets',
    description: 'Animais de estimacao sao bem-vindos'
  },
  {
    key: 'allowsSmoking',
    icon: Cigarette,
    title: 'Permite fumar',
    description: 'Passageiros podem fumar durante a viagem'
  },
  {
    key: 'allowsLuggage',
    icon: Luggage,
    title: 'Aceita bagagem',
    description: 'Ha espaco para malas e volumes maiores'
  }
] as const

export function StepComforts() {
  const { formData, updateFormData } = usePublish()

  const toggleComfort = (key: 'allowsPets' | 'allowsSmoking' | 'allowsLuggage') => {
    updateFormData({ [key]: !formData[key] })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Settings2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{PUBLISH.step6.title}</h2>
          <p className="text-sm text-muted-foreground">{PUBLISH.step6.subtitle}</p>
        </div>
      </div>

      {/* Comfort toggles */}
      <div className="space-y-3">
        {comfortOptions.map((option) => {
          const Icon = option.icon
          const isActive = formData[option.key]
          
          return (
            <div
              key={option.key}
              role="button"
              tabIndex={0}
              onClick={() => toggleComfort(option.key)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggleComfort(option.key)
                }
              }}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer",
                isActive 
                  ? "border-primary bg-primary/5" 
                  : "border-border bg-card hover:border-muted-foreground/30"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  isActive ? "bg-primary/10" : "bg-muted"
                )}>
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <div className="text-left">
                  <p className={cn(
                    "font-medium",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {option.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
              
              <Switch
                checked={isActive}
                onCheckedChange={() => toggleComfort(option.key)}
                aria-label={option.title}
              />
            </div>
          )
        })}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <Label htmlFor="description">Mensagem para passageiros (opcional)</Label>
        </div>
        <Textarea
          id="description"
          placeholder="Ex: Saida pontual, faco parada para cafe no meio do caminho, ar-condicionado, som ambiente..."
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          className="min-h-[120px] resize-none"
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground text-right">
          {formData.description.length}/500 caracteres
        </p>
      </div>

      {/* Summary */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm font-medium text-foreground mb-2">Resumo das preferencias:</p>
        <div className="flex flex-wrap gap-2">
          {formData.allowsPets && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              <PawPrint className="w-3 h-3" /> Pets ok
            </span>
          )}
          {formData.allowsSmoking && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              <Cigarette className="w-3 h-3" /> Fumar ok
            </span>
          )}
          {formData.allowsLuggage && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              <Luggage className="w-3 h-3" /> Bagagem ok
            </span>
          )}
          {!formData.allowsPets && !formData.allowsSmoking && !formData.allowsLuggage && (
            <span className="text-xs text-muted-foreground">Nenhuma preferencia selecionada</span>
          )}
        </div>
      </div>
    </div>
  )
}
