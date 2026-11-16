'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

export function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Espera um momento para o contexto carregar
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push('/')
        return
      }

      if (user?.role !== 'admin') {
        router.push('/dashboard/buscar')
        return
      }

      setIsAuthorized(true)
      setIsChecking(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [isAuthenticated, user, router])

  // Loading enquanto verifica
  if (isChecking || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-gray-500">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
