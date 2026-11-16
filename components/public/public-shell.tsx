'use client'

import { type ReactNode } from 'react'
import { PublicHeader } from './public-header'
import { PublicFooter } from './public-footer'
import { LoginModal } from '@/components/login-modal'

interface PublicShellProps {
  children: ReactNode
  showFooter?: boolean
}

export function PublicShell({ children, showFooter = true }: PublicShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <PublicFooter />}
      <LoginModal />
    </div>
  )
}
