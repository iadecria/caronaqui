'use client'

import { useState } from 'react'
import { Navigation } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePublish } from '@/contexts/publish-context'
import { PUBLISH } from '@/lib/identity'
import { AddressAutocomplete } from '@/components/maps/address-autocomplete'
import { MapPreview } from '@/components/maps/map-preview'
import type { AddressSuggestion } from '@/hooks/use-address-search'

export function StepDestination() {
  const { formData, updateDestination } = usePublish()
  const { destination, origin } = formData
  const [searchValue, setSearchValue] = useState(
    destination.city ? `${destination.neighborhood ? destination.neighborhood + ', ' : ''}${destination.city}` : ''
  )
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    destination.lat && destination.lng ? { lat: destination.lat, lng: destination.lng } : null
  )

  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    updateDestination({
      state: suggestion.state,
      city: suggestion.city,
      neighborhood: suggestion.neighborhood,
      lat: suggestion.lat,
      lng: suggestion.lng
    })
    setSelectedLocation({ lat: suggestion.lat, lng: suggestion.lng })
  }

  // Prepara dados do mapa com origem se disponivel
  const originLocation = origin.lat && origin.lng 
    ? { lat: origin.lat, lng: origin.lng, label: origin.neighborhood || origin.city }
    : undefined

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          <Navigation className="w-4 h-4 md:w-5 md:h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground">{PUBLISH.step2.title}</h2>
          <p className="text-xs md:text-sm text-muted-foreground">{PUBLISH.step2.subtitle}</p>
        </div>
      </div>

      {/* Autocomplete de endereco */}
      <div className="space-y-2">
        <Label htmlFor="dest-address">Local de destino</Label>
        <AddressAutocomplete
          value={searchValue}
          onChange={setSearchValue}
          onSelect={handleAddressSelect}
          placeholder="Digite o bairro ou cidade de destino..."
          icon="destination"
        />
        {destination.city && (
          <p className="text-xs text-muted-foreground">
            Selecionado: {destination.neighborhood ? `${destination.neighborhood}, ` : ''}{destination.city}, {destination.state}
          </p>
        )}
      </div>

      {/* Mapa de preview mostrando origem e destino */}
      {(selectedLocation || originLocation) && (
        <div className="space-y-2">
          <Label>Visualizar rota</Label>
          <MapPreview
            origin={originLocation}
            destination={selectedLocation ? {
              lat: selectedLocation.lat,
              lng: selectedLocation.lng,
              label: destination.neighborhood || destination.city
            } : undefined}
            className="h-40 md:h-48"
          />
        </div>
      )}

      {/* Ponto de desembarque */}
      <div className="space-y-2">
        <Label htmlFor="dest-dropoff">Ponto de desembarque</Label>
        <Input
          id="dest-dropoff"
          placeholder="Ex: Estacao de metro, Shopping, Avenida principal..."
          value={destination.dropOffPoint || ''}
          onChange={(e) => updateDestination({ dropOffPoint: e.target.value })}
          className="h-11"
        />
        <p className="text-[11px] md:text-xs text-muted-foreground">
          Onde voce deixara os passageiros
        </p>
      </div>
    </div>
  )
}
