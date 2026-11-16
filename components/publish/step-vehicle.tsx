'use client'

import { Car, Users, Minus, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePublish } from '@/contexts/publish-context'
import { PUBLISH } from '@/lib/identity'

const carModels = [
  'Honda Civic',
  'Toyota Corolla',
  'Volkswagen Jetta',
  'Chevrolet Cruze',
  'Hyundai HB20',
  'Fiat Argo',
  'Jeep Compass',
  'Volkswagen Polo',
  'Nissan Kicks',
  'Ford Ka',
  'Outro'
]

const carColors = [
  'Branco',
  'Prata',
  'Preto',
  'Cinza',
  'Vermelho',
  'Azul',
  'Bege',
  'Marrom',
  'Verde',
  'Dourado'
]

export function StepVehicle() {
  const { formData, updateFormData } = usePublish()

  const incrementSeats = () => {
    if (formData.availableSeats < 7) {
      updateFormData({ availableSeats: formData.availableSeats + 1 })
    }
  }

  const decrementSeats = () => {
    if (formData.availableSeats > 1) {
      updateFormData({ availableSeats: formData.availableSeats - 1 })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Car className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{PUBLISH.step4.title}</h2>
          <p className="text-sm text-muted-foreground">{PUBLISH.step4.subtitle}</p>
        </div>
      </div>

      {/* Vagas disponiveis */}
      <div className="space-y-3">
        <Label>Vagas disponiveis</Label>
        <div className="flex items-center justify-center gap-6 p-4 bg-muted/50 rounded-xl">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={decrementSeats}
            disabled={formData.availableSeats <= 1}
            className="h-12 w-12 rounded-full"
          >
            <Minus className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <span className="text-4xl font-bold text-foreground font-mono tabular-nums">
              {formData.availableSeats}
            </span>
            <span className="text-muted-foreground">
              {formData.availableSeats === 1 ? 'vaga' : 'vagas'}
            </span>
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={incrementSeats}
            disabled={formData.availableSeats >= 7}
            className="h-12 w-12 rounded-full"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Modelo do carro */}
      <div className="space-y-2">
        <Label htmlFor="car-model">Modelo do carro</Label>
        <Select
          value={formData.carModel}
          onValueChange={(value) => updateFormData({ carModel: value })}
        >
          <SelectTrigger id="car-model">
            <SelectValue placeholder="Selecione o modelo" />
          </SelectTrigger>
          <SelectContent>
            {carModels.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formData.carModel === 'Outro' && (
          <Input
            placeholder="Digite o modelo do seu carro"
            className="mt-2"
            onChange={(e) => updateFormData({ carModel: e.target.value })}
          />
        )}
      </div>

      {/* Cor do carro */}
      <div className="space-y-2">
        <Label htmlFor="car-color">Cor do carro</Label>
        <Select
          value={formData.carColor}
          onValueChange={(value) => updateFormData({ carColor: value })}
        >
          <SelectTrigger id="car-color">
            <SelectValue placeholder="Selecione a cor" />
          </SelectTrigger>
          <SelectContent>
            {carColors.map((color) => (
              <SelectItem key={color} value={color}>
                {color}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Preview */}
      {formData.carModel && formData.carColor && (
        <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-3">
          <Car className="w-8 h-8 text-primary" />
          <div>
            <p className="font-medium text-foreground">{formData.carModel}</p>
            <p className="text-sm text-muted-foreground">Cor {formData.carColor.toLowerCase()} - {formData.availableSeats} vagas</p>
          </div>
        </div>
      )}
    </div>
  )
}
