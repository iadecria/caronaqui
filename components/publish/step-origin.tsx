'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePublish } from '@/contexts/publish-context'
import { PUBLISH } from '@/lib/identity'
import { AddressAutocomplete } from '@/components/maps/address-autocomplete'
import { MapPreview } from '@/components/maps/map-preview'
import type { AddressSuggestion } from '@/hooks/use-address-search'

export function StepOrigin() {
  const { formData, updateOrigin } = usePublish()
  const { origin } = formData
  const [searchValue, setSearchValue] = useState(
    origin.city ? `${origin.neighborhood ? origin.neighborhood + ', ' : ''}${origin.city}` : ''
  )
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    origin.lat && origin.lng ? { lat: origin.lat, lng: origin.lng } : null
  )

  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    updateOrigin({
      state: suggestion.state,
      city: suggestion.city,
      neighborhood: suggestion.neighborhood,
      lat: suggestion.lat,
      lng: suggestion.lng
    })
    setSelectedLocation({ lat: suggestion.lat, lng: suggestion.lng })
  }

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground">{PUBLISH.step1.title}</h2>
          <p className="text-xs md:text-sm text-muted-foreground">{PUBLISH.step1.subtitle}</p>
        </div>
      </div>

      {/* Autocomplete de endereco */}
      <div className="space-y-2">
        <Label htmlFor="origin-address">Local de partida</Label>
        <AddressAutocomplete
          value={searchValue}
          onChange={setSearchValue}
          onSelect={handleAddressSelect}
          placeholder="Digite o bairro ou cidade de saida..."
          icon="origin"
        />
        {origin.city && (
          <p className="text-xs text-muted-foreground">
            Selecionado: {origin.neighborhood ? `${origin.neighborhood}, ` : ''}{origin.city}, {origin.state}
          </p>
        )}
      </div>

      {/* Mapa de preview */}
      {selectedLocation && (
        <div className="space-y-2">
          <Label>Confirme a localizacao</Label>
          <MapPreview
            origin={{
              lat: selectedLocation.lat,
              lng: selectedLocation.lng,
              label: origin.neighborhood || origin.city
            }}
            className="h-40 md:h-48"
          />
        </div>
      )}

      {/* Ponto de encontro */}
      <div className="space-y-2">
        <Label htmlFor="origin-meeting">Ponto de encontro</Label>
        <Input
          id="origin-meeting"
          placeholder="Ex: Estacao de metro, Shopping, Posto de gasolina..."
          value={origin.meetingPoint || ''}
          onChange={(e) => updateOrigin({ meetingPoint: e.target.value })}
          className="h-11"
        />
        <p className="text-[11px] md:text-xs text-muted-foreground">
          Escolha um local facil de encontrar para os passageiros
        </p>
      </div>
    </div>
  )
}
