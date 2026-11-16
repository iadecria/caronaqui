'use client'

import React from 'react'
import { Search, Bell, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

export function AdminHeader() {
  const { logout, user } = useAuth()
  const router = useRouter()

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handleLogout = () => {
    logout()
    router.push('/admin/dev-login')
  }

  return (
    <header className="fixed left-64 right-0 top-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-30">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar usuários, viagens..."
            className="pl-10 border-gray-300 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 ml-8">
        {/* Notification */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
        </Button>

        {/* Date */}
        <div className="text-sm text-gray-600 capitalize">
          {today}
        </div>

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div className="text-right text-xs">
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-gray-500">Dev Mode</p>
            </div>
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-full"
            />
          </div>
        )}

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="icon"
          title="Logout"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}

