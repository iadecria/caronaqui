import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Viagens - CaronAqui Admin',
  description: 'Gerenciamento de viagens',
}

export default function AdminTripsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Viagens</h1>
        <p className="text-gray-600 mt-2">Monitore e gerencie todas as viagens da plataforma</p>
      </div>
      
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Viagens</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  )
}
