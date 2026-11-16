'use client'

import { useAuth } from '@/contexts/auth-context'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { UserIcon, LogOutIcon, LayoutDashboardIcon } from 'lucide-react'

export function PublicHeader() {
  const { user, isAuthenticated, setShowLoginModal, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Logo size="sm" showText />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/#como-funciona" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Como funciona
          </Link>
          <Link 
            href="/#rotas-populares" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Rotas populares
          </Link>
          <Link 
            href="/#seguranca" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Seguranca
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/buscar" className="cursor-pointer">
                    <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                    Buscar caronas
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/perfil" className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Meu perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                variant="ghost" 
                className="hidden sm:inline-flex"
                onClick={() => setShowLoginModal(true)}
              >
                Entrar
              </Button>
              <Button onClick={() => setShowLoginModal(true)}>
                Cadastrar
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
