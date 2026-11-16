'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PublishProvider, usePublish } from '@/contexts/publish-context'
import { StepIndicator } from '@/components/publish/step-indicator'
import { StepNavigation } from '@/components/publish/step-navigation'
import { StepOrigin } from '@/components/publish/step-origin'
import { StepDestination } from '@/components/publish/step-destination'
import { StepDateTime } from '@/components/publish/step-datetime'
import { StepVehicle } from '@/components/publish/step-vehicle'
import { StepPrice } from '@/components/publish/step-price'
import { StepComforts } from '@/components/publish/step-comforts'
import { StepReview } from '@/components/publish/step-review'
import { PUBLISH, LABELS } from '@/lib/identity'

function PublishWizard() {
  const router = useRouter()
  const { currentStep, resetForm, totalSteps } = usePublish()
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)

  const handlePublish = async () => {
    setIsPublishing(true)
    
    // Simular delay de publicacao
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsPublishing(false)
    setIsPublished(true)
  }

  const handleNewRide = () => {
    resetForm()
    setIsPublished(false)
  }

  const handleGoToDashboard = () => {
    resetForm()
    router.push('/dashboard/buscar')
  }

  // Tela de sucesso
  if (isPublished) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          {PUBLISH.success.title}
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          {PUBLISH.success.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleNewRide} variant="outline">
            Publicar outra carona
          </Button>
          <Button onClick={handleGoToDashboard}>
            Ir para o painel
          </Button>
        </div>
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOrigin />
      case 2:
        return <StepDestination />
      case 3:
        return <StepDateTime />
      case 4:
        return <StepVehicle />
      case 5:
        return <StepPrice />
      case 6:
        return <StepComforts />
      case 7:
        return <StepReview />
      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:px-6 md:py-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-semibold text-foreground mb-1 md:mb-2">{LABELS.publishRide}</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          {PUBLISH.step0.subtitle}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-6 md:mb-8">
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      {/* Step content */}
      <div className="bg-card rounded-xl md:rounded-2xl border border-border p-4 md:p-8">
        {renderStep()}
        
        {/* Navigation */}
        <StepNavigation onPublish={handlePublish} isPublishing={isPublishing} />
      </div>

      {/* Tips - hidden on mobile to save space */}
      <div className="mt-4 md:mt-6 text-center hidden md:block">
        <p className="text-sm text-muted-foreground">
          Seu progresso e salvo automaticamente. Voce pode continuar depois.
        </p>
      </div>
    </div>
  )
}

export default function PublicarPage() {
  return (
    <PublishProvider>
      <PublishWizard />
    </PublishProvider>
  )
}
