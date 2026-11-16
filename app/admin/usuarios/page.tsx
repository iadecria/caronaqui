import React from 'react'
import { AdminUsersModeration } from '@/components/admin/admin-users-moderation'

export const metadata = {
  title: 'Usuários - CaronAqui Admin',
  description: 'Moderação de usuários',
}

export default function AdminUsersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Moderação de Usuários</h1>
        <p className="text-gray-600 mt-2">Gerencie e valide os usuários da plataforma</p>
      </div>
      
      <AdminUsersModeration />
    </div>
  )
}
