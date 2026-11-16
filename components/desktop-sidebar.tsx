"use client"

import { Search, PlusCircle, Heart, User, Bell, Settings, LogOut, ChevronRight, Ticket, MessageCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "./logo"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useNotifications } from "@/contexts/notifications-context"

const navItems = [
  {
    label: "Buscar caronas",
    href: "/dashboard/buscar",
    icon: Search
  },
  {
    label: "Publicar carona",
    href: "/dashboard/publicar",
    icon: PlusCircle,
    highlight: true
  },
  {
    label: "Suas viagens",
    href: "/dashboard/minhas-reservas",
    icon: Ticket
  },
  {
    label: "Favoritos",
    href: "/dashboard/favoritos",
    icon: Heart
  },
]

const secondaryItems = [
  {
    label: "Mensagens",
    href: "/dashboard/mensagens",
    icon: MessageCircle
  },
  {
    label: "Notificacoes",
    href: "/dashboard/notificacoes",
    icon: Bell,
    hasDynamicBadge: true
  },
  {
    label: "Configuracoes",
    href: "/dashboard/configuracoes",
    icon: Settings
  },
]

export function DesktopSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col bg-zinc-950 border-r border-zinc-800 h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/dashboard/buscar">
          <Logo size="md" showText />
        </Link>
      </div>

      <Separator className="bg-zinc-800" />

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          if (item.highlight) {
            return (
              <Link key={item.href} href={item.href}>
                <Button 
                  className="w-full justify-start gap-3 mt-2 mb-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-zinc-800 hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
              {item.label}
              {isActive && (
                <ChevronRight className="h-4 w-4 ml-auto" />
              )}
            </Link>
          )
        })}

        <Separator className="my-4 bg-zinc-800" />

        {secondaryItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-zinc-800 hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
              {item.label}
              {item.hasDynamicBadge && unreadCount > 0 && (
                <span className="ml-auto bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-zinc-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-zinc-800 transition-colors text-left">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name || 'Usuario'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || 'email@exemplo.com'}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/perfil" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Meu perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/configuracoes" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configuracoes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => {
                logout()
                window.location.href = '/'
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
