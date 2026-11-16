'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Logo } from '@/components/logo'
import { MailIcon, LockIcon, UserIcon, EyeIcon, EyeOffIcon } from 'lucide-react'

type AuthMode = 'login' | 'register'

export function LoginModal() {
  const { showLoginModal, setShowLoginModal, login, register, devLogin, isLoading } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setError(null)
    setShowPassword(false)
  }

  const handleModeSwitch = (newMode: AuthMode) => {
    setMode(newMode)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (mode === 'login') {
      if (!email || !password) {
        setError('Preencha todos os campos')
        return
      }
      const success = await login(email, password)
      if (!success) {
        setError('Email ou senha incorretos')
      }
    } else {
      if (!name || !email || !password) {
        setError('Preencha todos os campos')
        return
      }
      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres')
        return
      }
      const success = await register(name, email, password)
      if (!success) {
        setError('Erro ao criar conta. Tente novamente.')
      }
    }
  }

  const handleOpenChange = (open: boolean) => {
    setShowLoginModal(open)
    if (!open) {
      resetForm()
      setMode('login')
    }
  }

  return (
    <Dialog open={showLoginModal} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center">
          <Logo size="md" showText={false} />
          <DialogTitle className="text-xl mt-2">
            {mode === 'login' ? 'Entrar no CaronAqui' : 'Criar sua conta'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'login'
              ? 'Entre para reservar caronas e publicar suas viagens'
              : 'Cadastre-se para comecar a compartilhar caronas'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {mode === 'register' && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nome completo</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={mode === 'register' ? 'Minimo 6 caracteres' : 'Sua senha'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? (
              <Spinner className="size-4" />
            ) : mode === 'login' ? (
              'Entrar'
            ) : (
              'Criar conta'
            )}
          </Button>
        </form>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {mode === 'login' ? 'Novo por aqui?' : 'Ja tem conta?'}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleModeSwitch(mode === 'login' ? 'register' : 'login')}
          disabled={isLoading}
        >
          {mode === 'login' ? 'Criar uma conta' : 'Fazer login'}
        </Button>

        {/* Dev Login - apenas para testes */}
        {process.env.NODE_ENV !== 'production' && (
          <>
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-dashed border-amber-500/50" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-amber-600 font-mono">DEV MODE</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="border-amber-500/50 text-amber-600 hover:bg-amber-500/10 hover:text-amber-700"
                onClick={() => devLogin('dev')}
                disabled={isLoading}
              >
                Dev
              </Button>
              <Button
                variant="outline"
                className="border-blue-500/50 text-blue-600 hover:bg-blue-500/10 hover:text-blue-700"
                onClick={() => devLogin('user')}
                disabled={isLoading}
              >
                User
              </Button>
              <Button
                variant="outline"
                className="border-red-500/50 text-red-600 hover:bg-red-500/10 hover:text-red-700"
                onClick={() => devLogin('admin')}
                disabled={isLoading}
              >
                Admin
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
