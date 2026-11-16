import React from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'
import { AdminProtectedLayout } from '@/components/admin/admin-protected-layout'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProtectedLayout>
      <div className="min-h-screen bg-gray-100">
        <AdminSidebar />
        <AdminHeader />
        
        {/* Main Content */}
        <main className="ml-64 mt-16 p-8">
          {children}
        </main>
      </div>
    </AdminProtectedLayout>
  )
}
