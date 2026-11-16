'use client'

import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePublish } from '@/contexts/publish-context'

interface StepNavigationProps {
  onPublish?: () => void
  isPublishing?: boolean
}

export function StepNavigation({ onPublish, isPublishing }: StepNavigationProps) {
  const { currentStep, totalSteps, nextStep, prevStep, isStepValid } = usePublish()

  const isLastStep = currentStep === totalSteps
  const canGoNext = isStepValid(currentStep)

  return (
    <div className="flex justify-between gap-4 pt-6 border-t border-border">
      <Button
        variant="outline"
        onClick={prevStep}
        disabled={currentStep === 1}
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Voltar</span>
      </Button>

      {isLastStep ? (
        <Button
          onClick={onPublish}
          disabled={!canGoNext || isPublishing}
          className="gap-2"
        >
          {isPublishing ? (
            <>Publicando...</>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Publicar carona
            </>
          )}
        </Button>
      ) : (
        <Button
          onClick={nextStep}
          disabled={!canGoNext}
          className="gap-2"
        >
          <span className="hidden sm:inline">Continuar</span>
          <span className="sm:hidden">Proximo</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
