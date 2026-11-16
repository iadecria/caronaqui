import React from 'react'
import { AdminSettings } from '@/components/admin/admin-settings'

export const metadata = {
  title: 'Configurações - CaronAqui Admin',
  description: 'Configurações do sistema',
}

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
        <p className="text-gray-600 mt-2">Configure parâmetros críticos da plataforma</p>
      </div>
      
      <AdminSettings />
    </div>
  )
}
