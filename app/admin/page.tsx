import React from 'react'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export const metadata = {
  title: 'Visão Geral - CaronAqui Admin',
  description: 'Painel administrativo do CaronAqui',
}

export default function AdminPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Visão Geral</h1>
        <p className="text-gray-600 mt-2">Bem-vindo ao painel administrativo do CaronAqui</p>
      </div>
      
      <AdminDashboard />
    </div>
  )
}
