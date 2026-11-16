'use client'

import React, { useState } from 'react'
import { Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AdminSettings() {
  const [basePriceKm, setBasePriceKm] = useState('0,30')
  const [fluctuationMargin, setFluctuationMargin] = useState('20')
  const [redZoneHours, setRedZoneHours] = useState('1')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Pricing Card */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Precificação do Termômetro</CardTitle>
          <CardDescription className="text-gray-600">
            Configure os valores que os motoristas podem cobrar em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="base-price" className="text-gray-700 font-semibold">
              Valor Base por KM
            </Label>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-gray-700 font-semibold">R$</span>
              <Input
                id="base-price"
                type="text"
                value={basePriceKm}
                onChange={(e) => setBasePriceKm(e.target.value)}
                className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                placeholder="0,30"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Valor cobrado por quilômetro de deslocamento
            </p>
          </div>

          <div>
            <Label htmlFor="fluctuation" className="text-gray-700 font-semibold">
              Margem de Flutuação Permitida
            </Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                id="fluctuation"
                type="number"
                value={fluctuationMargin}
                onChange={(e) => setFluctuationMargin(e.target.value)}
                className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                placeholder="20"
              />
              <span className="text-gray-700 font-semibold">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Percentual máximo que motoristas podem aumentar ou diminuir o preço
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Rules Card */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Regras de Cancelamento</CardTitle>
          <CardDescription className="text-gray-600">
            Configure as penalidades e limites de tempo para cancelamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="red-zone" className="text-gray-700 font-semibold">
              Horas de Zona Vermelha (Limite para Punição)
            </Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                id="red-zone"
                type="number"
                value={redZoneHours}
                onChange={(e) => setRedZoneHours(e.target.value)}
                className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                placeholder="1"
              />
              <span className="text-gray-700 font-semibold">hora(s)</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Tempo antes de uma viagem para aplicar punição por cancelamento
            </p>
          </div>

          <div>
            <Label className="text-gray-700 font-semibold">
              Penalidades Padrão
            </Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-700">Suspensão Temporária</span>
                <span className="text-sm font-semibold text-gray-900">24 horas</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-700">Redução de Avaliação</span>
                <span className="text-sm font-semibold text-gray-900">-0.5 ⭐</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Notifications Card */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Notificações do Sistema</CardTitle>
          <CardDescription className="text-gray-600">
            Configure como o sistema se comunica com os usuários
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm text-gray-700">Email de Aviso de Cancelamento</span>
            <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded">Ativo</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm text-gray-700">Push em Viagem Criada</span>
            <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded">Ativo</span>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button 
          onClick={handleSave}
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold flex-1 h-11"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações do Sistema
        </Button>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-semibold text-green-800">
            ✓ Configurações salvas com sucesso!
          </p>
        </div>
      )}
    </div>
  )
}
