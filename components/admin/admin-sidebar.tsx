'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Users, Car, AlertTriangle, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/auth-context'

const navItems = [
  { label: 'Visão Geral', href: '/admin', icon: BarChart3 },
  { label: 'Usuários', href: '/admin/usuarios', icon: Users },
  { label: 'Viagens', href: '/admin/viagens', icon: Car },
  { label: 'Denúncias', href: '/admin/denuncias', icon: AlertTriangle },
  { label: 'Configurações', href: '/admin/configuracoes', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-purple-900 to-purple-950 border-r border-purple-800 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-purple-800">
        <h1 className="text-xl font-bold text-white">
          <span className="text-teal-400">Caronaqui</span> Admin
        </h1>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm',
                isActive
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'text-purple-200 hover:bg-purple-800/50 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-purple-800 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.charAt(0) || 'A'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-purple-300 truncate">{user?.email}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-purple-200 hover:text-red-400 hover:bg-red-500/10"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </aside>
  )
}
