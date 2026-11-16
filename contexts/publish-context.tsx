'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface PublishFormData {
  // Step 1: Origem
  origin: {
    city: string
    state: string
    neighborhood: string
    meetingPoint: string
    lat?: number
    lng?: number
  }
  // Step 2: Destino
  destination: {
    city: string
    state: string
    neighborhood: string
    dropOffPoint: string
    lat?: number
    lng?: number
  }
  // Step 3: Data e Hora
  date: string
  time: string
  // Step 4: Veiculo
  availableSeats: number
  carModel: string
  carColor: string
  // Step 5: Preco
  price: number
  // Step 6: Confortos
  allowsPets: boolean
  allowsSmoking: boolean
  allowsLuggage: boolean
  description: string
}

const initialFormData: PublishFormData = {
  origin: {
    city: '',
    state: '',
    neighborhood: '',
    meetingPoint: ''
  },
  destination: {
    city: '',
    state: '',
    neighborhood: '',
    dropOffPoint: ''
  },
  date: '',
  time: '',
  availableSeats: 3,
  carModel: '',
  carColor: '',
  price: 80,
  allowsPets: false,
  allowsSmoking: false,
  allowsLuggage: true,
  description: ''
}

interface PublishContextType {
  currentStep: number
  formData: PublishFormData
  setCurrentStep: (step: number) => void
  updateFormData: (data: Partial<PublishFormData>) => void
  updateOrigin: (data: Partial<PublishFormData['origin']>) => void
  updateDestination: (data: Partial<PublishFormData['destination']>) => void
  nextStep: () => void
  prevStep: () => void
  resetForm: () => void
  isStepValid: (step: number) => boolean
  totalSteps: number
}

const PublishContext = createContext<PublishContextType | undefined>(undefined)

const STORAGE_KEY = 'caronaqui_publish_draft'

export function PublishProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<PublishFormData>(initialFormData)
  const [isHydrated, setIsHydrated] = useState(false)
  const totalSteps = 7

  // Hidratar do sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setFormData(parsed.formData || initialFormData)
        setCurrentStep(parsed.currentStep || 1)
      } catch {
        // Ignorar erro de parse
      }
    }
    setIsHydrated(true)
  }, [])

  // Salvar no sessionStorage
  useEffect(() => {
    if (isHydrated) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep }))
    }
  }, [formData, currentStep, isHydrated])

  const updateFormData = (data: Partial<PublishFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const updateOrigin = (data: Partial<PublishFormData['origin']>) => {
    setFormData(prev => ({
      ...prev,
      origin: { ...prev.origin, ...data }
    }))
  }

  const updateDestination = (data: Partial<PublishFormData['destination']>) => {
    setFormData(prev => ({
      ...prev,
      destination: { ...prev.destination, ...data }
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setCurrentStep(1)
    sessionStorage.removeItem(STORAGE_KEY)
  }

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.origin.city &&
          formData.origin.state
        )
      case 2:
        return !!(
          formData.destination.city &&
          formData.destination.state
        )
      case 3:
        return !!(formData.date && formData.time)
      case 4:
        return !!(
          formData.availableSeats > 0 &&
          formData.carModel &&
          formData.carColor
        )
      case 5:
        return formData.price >= 10
      case 6:
        return true // Confortos sao opcionais
      case 7:
        return (
          isStepValid(1) &&
          isStepValid(2) &&
          isStepValid(3) &&
          isStepValid(4) &&
          isStepValid(5)
        )
      default:
        return false
    }
  }

  return (
    <PublishContext.Provider
      value={{
        currentStep,
        formData,
        setCurrentStep,
        updateFormData,
        updateOrigin,
        updateDestination,
        nextStep,
        prevStep,
        resetForm,
        isStepValid,
        totalSteps
      }}
    >
      {children}
    </PublishContext.Provider>
  )
}

export function usePublish() {
  const context = useContext(PublishContext)
  if (!context) {
    throw new Error('usePublish must be used within PublishProvider')
  }
  return context
}
