'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  stepLabels?: string[]
}

const defaultLabels = [
  'Origem',
  'Destino',
  'Data/Hora',
  'Veiculo',
  'Preco',
  'Confortos',
  'Revisao'
]

export function StepIndicator({ 
  currentStep, 
  totalSteps, 
  stepLabels = defaultLabels 
}: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative mb-2">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps dots - visible on md+ */}
      <div className="hidden md:flex justify-between relative">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1
          const isCompleted = step < currentStep
          const isCurrent = step === currentStep

          return (
            <div key={step} className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step
                )}
              </div>
              <span 
                className={cn(
                  "mt-2 text-xs font-medium",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {stepLabels[i]}
              </span>
            </div>
          )
        })}
      </div>

      {/* Mobile: show current step */}
      <div className="md:hidden flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Passo {currentStep} de {totalSteps}
        </span>
        <span className="text-sm font-medium text-foreground">
          {stepLabels[currentStep - 1]}
        </span>
      </div>
    </div>
  )
}
