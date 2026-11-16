import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Denúncias - CaronAqui Admin',
  description: 'Gerenciamento de denúncias',
}

export default function AdminReportsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Denúncias</h1>
        <p className="text-gray-600 mt-2">Revise e processe denúncias da comunidade</p>
      </div>
      
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Denúncias</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  )
}
