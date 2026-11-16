'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { AppShell } from '@/components/app-shell'
import { LoginModal } from '@/components/login-modal'
import { Spinner } from '@/components/ui/spinner'
import { InstallPrompt } from '@/components/pwa/install-prompt'

// Rotas que podem ser acessadas sem autenticacao
// Login so sera exigido em acoes especificas (reservar, favoritar, mensagens)
const PUBLIC_ROUTES = [
  '/dashboard/buscar',
  '/dashboard/carona', // Ver detalhes de carona e mapa (login so ao reservar)
  '/dashboard', // Home com busca
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading, setShowLoginModal } = useAuth()
  const pathname = usePathname()
  
  const isPublic = PUBLIC_ROUTES.some(route => pathname.startsWith(route))

  // Mostra loading enquanto verifica autenticacao
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="size-8 text-primary" />
      </div>
    )
  }

  // Se e rota publica, permite acesso sem autenticacao
  if (isPublic) {
    return (
      <>
        <AppShell>{children}</AppShell>
        <LoginModal />
        <InstallPrompt />
      </>
    )
  }

  // Se nao esta autenticado em rota privada, mostra conteudo com overlay + modal
  if (!isAuthenticated) {
    return (
      <>
        <AppShell>
          <div className="relative">
            <div className="pointer-events-none select-none opacity-50 blur-sm">
              {children}
            </div>
          </div>
        </AppShell>
        <LoginModal />
      </>
    )
  }

  return (
    <>
      <AppShell>{children}</AppShell>
      <LoginModal />
      <InstallPrompt />
    </>
  )
}
