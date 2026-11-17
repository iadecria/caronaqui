'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  phone?: string
  verifiedPhone: boolean
  verifiedId: boolean
  memberSince: string
  role?: 'user' | 'admin' | 'dev'
  gender?: 'male' | 'female' | 'other'
  rating?: number
  totalRides?: number
}

// Acao pendente que sera executada apos login bem-sucedido
export type PendingAction = {
  type: string
  payload?: Record<string, unknown>
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoggedIn: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  devLogin: (type?: 'dev' | 'user' | 'admin') => void
  logout: () => void
  updateUser: (data: Partial<User>) => void
  showLoginModal: boolean
  setShowLoginModal: (show: boolean) => void
  loginRedirectPath: string | null
  setLoginRedirectPath: (path: string | null) => void
  // Acao pendente: preserva o que o usuario tentou fazer antes do login
  pendingAction: PendingAction | null
  setPendingAction: (action: PendingAction | null) => void
  // Helper: abre o modal salvando caminho e acao pendente
  openLoginModal: (redirectPath?: string, action?: PendingAction) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Usuarios mockados para testes
const mockUser: User = {
  id: 'u1',
  name: 'Joao Pedro',
  email: 'joao@email.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JoaoPedro',
  phone: '(21) 99999-8888',
  verifiedPhone: true,
  verifiedId: true,
  memberSince: '2024-01-15',
  role: 'user',
  rating: 4.9,
  totalRides: 12,
  gender: 'male'
}

const mockUserDev: User = {
  id: 'u_dev',
  name: 'Maria Dev',
  email: 'dev@caronaqui.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MariaDev',
  phone: '(21) 99999-0001',
  verifiedPhone: true,
  verifiedId: true,
  memberSince: '2024-01-01',
  role: 'dev',
  rating: 5.0,
  totalRides: 48,
  gender: 'female'
}

const mockUserAdmin: User = {
  id: 'u_admin',
  name: 'Admin',
  email: 'admin@caronaqui.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminUser',
  phone: '(21) 99999-0002',
  verifiedPhone: true,
  verifiedId: true,
  memberSince: '2023-01-01',
  role: 'admin',
  rating: 5.0,
  totalRides: 0,
  gender: 'male'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginRedirectPath, setLoginRedirectPath] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const router = useRouter()

  // Abre o modal salvando rota e acao pendente em sessionStorage para
  // sobreviver a um eventual reload (ex: deep link em mobile PWA)
  const openLoginModal = useCallback((redirectPath?: string, action?: PendingAction) => {
    if (redirectPath) {
      setLoginRedirectPath(redirectPath)
      try { sessionStorage.setItem('caronaqui_redirect', redirectPath) } catch (_) {}
    }
    if (action) {
      setPendingAction(action)
      try { sessionStorage.setItem('caronaqui_pending_action', JSON.stringify(action)) } catch (_) {}
    }
    setShowLoginModal(true)
  }, [])

  // Finaliza a sessao apos login bem-sucedido, preservando a acao pendente
  // no sessionStorage para que a pagina de destino possa recupera-la
  const _onLoginSuccess = useCallback((loggedUser: User) => {
    setUser(loggedUser)
    setShowLoginModal(false)
    
    // Admin vai para /admin, outros para dashboard
    let redirectTo = loginRedirectPath
    if (!redirectTo) {
      redirectTo = loggedUser.role === 'admin' ? '/admin' : '/dashboard/buscar'
    }
    
    setLoginRedirectPath(null)
    // Nao limpa pendingAction aqui — a pagina de destino consome e limpa
    try { sessionStorage.removeItem('caronaqui_redirect') } catch (_) {}
    router.push(redirectTo)
  }, [loginRedirectPath, router])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (email && password) {
      const loggedUser = {
        ...mockUser,
        email,
        name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || 'Usuario'
      }
      setIsLoading(false)
      _onLoginSuccess(loggedUser)
      return true
    }
    
    setIsLoading(false)
    return false
  }, [_onLoginSuccess])

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (name && email && password) {
      const loggedUser = {
        ...mockUser,
        id: `u${Date.now()}`,
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s/g, '')}`,
        verifiedPhone: false,
        verifiedId: false,
        memberSince: new Date().toISOString().split('T')[0]
      }
      setIsLoading(false)
      _onLoginSuccess(loggedUser)
      return true
    }
    
    setIsLoading(false)
    return false
  }, [_onLoginSuccess])

  const devLogin = useCallback((type: 'dev' | 'user' | 'admin' = 'user') => {
    let userToLogin = mockUser
    
    if (type === 'dev') {
      userToLogin = mockUserDev
    } else if (type === 'admin') {
      userToLogin = mockUserAdmin
    }
    
    _onLoginSuccess(userToLogin)
  }, [_onLoginSuccess])

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...data } : prev))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setLoginRedirectPath(null)
    setPendingAction(null)
    try {
      sessionStorage.removeItem('caronaqui_redirect')
      sessionStorage.removeItem('caronaqui_pending_action')
    } catch (_) {}
    router.push('/')
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoggedIn: !!user,
        isLoading,
        login,
        register,
        devLogin,
        logout,
        updateUser,
        showLoginModal,
        setShowLoginModal,
        loginRedirectPath,
        setLoginRedirectPath,
        pendingAction,
        setPendingAction,
        openLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
