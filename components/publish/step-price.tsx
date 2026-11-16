'use client'

import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { usePublish } from '@/contexts/publish-context'
import { formatPrice } from '@/lib/format'
import { PUBLISH, getPriceIndicatorText } from '@/lib/identity'

const SUGGESTED_PRICES = {
  'Rio de Janeiro-Sao Paulo': { min: 70, max: 120, avg: 85 },
  'Sao Paulo-Rio de Janeiro': { min: 70, max: 120, avg: 88 },
  default: { min: 30, max: 150, avg: 80 }
}

export function StepPrice() {
  const { formData, updateFormData } = usePublish()

  // Determinar faixa de preco baseado na rota
  const routeKey = `${formData.origin.city}-${formData.destination.city}`
  const priceRange = SUGGESTED_PRICES[routeKey as keyof typeof SUGGESTED_PRICES] || SUGGESTED_PRICES.default

  const handleSliderChange = (value: number[]) => {
    updateFormData({ price: value[0] })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 10 && value <= 500) {
      updateFormData({ price: value })
    }
  }

  const getPriceIndicator = () => {
    const indicatorText = getPriceIndicatorText(formData.price, priceRange.avg)
    if (formData.price < priceRange.avg - 10) {
      return { icon: TrendingDown, text: indicatorText, color: 'text-green-600' }
    } else if (formData.price > priceRange.avg + 10) {
      return { icon: TrendingUp, text: indicatorText, color: 'text-amber-600' }
    }
    return { icon: DollarSign, text: indicatorText, color: 'text-primary' }
  }

  const indicator = getPriceIndicator()
  const IndicatorIcon = indicator.icon

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{PUBLISH.step5.title}</h2>
          <p className="text-sm text-muted-foreground">{PUBLISH.step5.subtitle}</p>
        </div>
      </div>

      {/* Price display */}
      <div className="text-center p-8 bg-muted/50 rounded-2xl">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-5xl font-bold text-foreground font-mono tabular-nums">
            {formatPrice(formData.price)}
          </span>
        </div>
        <p className="text-muted-foreground">por passageiro</p>
        
        <div className={`flex items-center justify-center gap-2 mt-4 ${indicator.color}`}>
          <IndicatorIcon className="w-4 h-4" />
          <span className="text-sm font-medium">{indicator.text}</span>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-4 px-2">
        <Slider
          value={[formData.price]}
          onValueChange={handleSliderChange}
          min={10}
          max={200}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatPrice(10)}</span>
          <span>{formatPrice(200)}</span>
        </div>
      </div>

      {/* Manual input */}
      <div className="space-y-2">
        <Label htmlFor="price-input">Ou digite o valor</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
          <Input
            id="price-input"
            type="number"
            min={10}
            max={500}
            value={formData.price}
            onChange={handleInputChange}
            className="pl-10 font-mono"
          />
        </div>
      </div>

      {/* Price suggestions */}
      <div className="space-y-2">
        <Label className="text-muted-foreground">Precos sugeridos para esta rota</Label>
        <div className="grid grid-cols-3 gap-2">
          {[priceRange.min, priceRange.avg, priceRange.max].map((price, index) => (
            <button
              key={price}
              type="button"
              onClick={() => updateFormData({ price })}
              className={`py-3 px-4 rounded-lg border transition-colors ${
                formData.price === price
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-foreground hover:border-primary/50'
              }`}
            >
              <div className="text-lg font-bold font-mono">{formatPrice(price)}</div>
              <div className="text-xs text-muted-foreground">
                {index === 0 ? 'Economico' : index === 1 ? 'Sugerido' : 'Premium'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Earnings estimate */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <p className="text-sm text-muted-foreground">Ganho estimado com {formData.availableSeats} passageiros:</p>
        <p className="text-2xl font-bold text-primary font-mono tabular-nums mt-1">
          {formatPrice(formData.price * formData.availableSeats)}
        </p>
      </div>
    </div>
  )
}
