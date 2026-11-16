'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Lock, Zap } from 'lucide-react'

export default function DevLoginPage() {
  const { devLogin, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router])

  // Feature-gated: rota inexistente em producao (NODE_ENV e constante em build)
  if (process.env.NODE_ENV === 'production') {
    notFound()
  }

  const handleDevLogin = () => {
    devLogin()
    router.push('/admin')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <Card className="w-full max-w-sm bg-zinc-900 border-zinc-800 shadow-2xl">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-white text-lg">CaronAqui</h1>
                <p className="text-xs text-zinc-400">Painel Admin Dev</p>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Acesso Desenvolvedor</h2>
              <p className="text-sm text-zinc-400">
                Você está acessando o painel administrativo em modo desenvolvedor.
              </p>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 space-y-2">
              <div className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Modo Desenvolvimento</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Este é um ambiente de desenvolvimento. Todas as ações são simuladas e não afetam dados reais.
                  </p>
                </div>
              </div>
            </div>

            {/* Funcionalidades */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">Acesso a:</p>
              <ul className="space-y-1.5">
                <li className="text-xs text-zinc-400 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
                  Dashboard com métricas
                </li>
                <li className="text-xs text-zinc-400 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
                  Moderação de usuários
                </li>
                <li className="text-xs text-zinc-400 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
                  Configurações do sistema
                </li>
                <li className="text-xs text-zinc-400 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
                  Monitoramento de viagens
                </li>
              </ul>
            </div>

            {/* Botão */}
            <Button
              onClick={handleDevLogin}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
            >
              Acessar Painel Admin
            </Button>

            {/* Footer */}
            <p className="text-xs text-zinc-500 text-center">
              Acesso restrito a desenvolvedores
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
