"use client"

import { Search, Plus, Briefcase, MessageCircle, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: typeof Search
  isMain?: boolean
}

const navItems: NavItem[] = [
  {
    label: "Buscar",
    href: "/dashboard/buscar",
    icon: Search,
  },
  {
    label: "Oferecer",
    href: "/dashboard/publicar",
    icon: Plus,
    isMain: true,
  },
  {
    label: "Suas viagens",
    href: "/dashboard/minhas-reservas",
    icon: Briefcase,
  },
  {
    label: "Mensagens",
    href: "/dashboard/mensagens",
    icon: MessageCircle,
  },
  {
    label: "Perfil",
    href: "/dashboard/perfil",
    icon: User,
  },
]

export function BottomNav() {
  const pathname = usePathname()
  const { isAuthenticated, setShowLoginModal } = useAuth()

  return (
    <nav className="bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-800">
      {/* Safe area para dispositivos com home indicator */}
      <div className="flex items-stretch justify-around h-16 max-w-screen-sm mx-auto px-1">
        {!isAuthenticated ? (
          // Modo nao autenticado: apenas busca e login
          <>
            <Link
              href="/dashboard/buscar"
              className={cn(
                "relative flex flex-col items-center justify-center gap-1",
                "flex-1 min-w-0 px-1 py-2",
                "transition-opacity duration-150 active:opacity-60",
                "select-none outline-none"
              )}
              aria-current={pathname === "/dashboard/buscar" ? "page" : undefined}
            >
              <div className={cn(
                "flex items-center justify-center rounded-2xl transition-all duration-200",
                "w-12 h-8",
                pathname === "/dashboard/buscar" || pathname === "/dashboard"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground"
              )}>
                <Search className="w-5 h-5 shrink-0" strokeWidth={2} />
              </div>
              <span className={cn(
                "text-[10px] leading-none font-medium w-full text-center truncate transition-colors duration-200",
                pathname === "/dashboard/buscar" || pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
              )}>
                Buscar
              </span>
            </Link>

            {/* Separador */}
            <div className="w-px h-8 bg-zinc-700/50 self-center" />

            {/* Botao de Login em Destaque */}
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex flex-col items-center justify-center gap-1 flex-1 min-w-0 px-1 py-2 transition-opacity duration-150 active:opacity-60 select-none outline-none"
              aria-label="Fazer login"
            >
              <div className="flex items-center justify-center rounded-2xl transition-all duration-200 w-12 h-8 bg-primary text-primary-foreground">
                <User className="w-5 h-5 shrink-0" strokeWidth={2} />
              </div>
              <span className="text-[10px] leading-none font-semibold w-full text-center truncate text-primary">
                Login
              </span>
            </button>
          </>
        ) : (
          // Modo autenticado: navegacao completa
          <>
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/dashboard/buscar" && pathname === "/dashboard")
              
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-1",
                    "flex-1 min-w-0 px-1 py-2",
                    "transition-opacity duration-150 active:opacity-60",
                    "select-none outline-none"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Pill de destaque no item ativo */}
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-2xl transition-all duration-200",
                      item.isMain
                        ? cn(
                            "w-12 h-8",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-primary/20 text-primary"
                          )
                        : cn(
                            "w-12 h-8",
                            isActive
                              ? "bg-primary/15 text-primary"
                              : "text-muted-foreground"
                          )
                    )}
                  >
                    <Icon
                      className="w-5 h-5 shrink-0"
                      strokeWidth={isActive || item.isMain ? 2.5 : 1.8}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={cn(
                      "text-[10px] leading-none font-medium w-full text-center truncate transition-colors duration-200",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </>
        )}
      </div>
    </nav>
  )
}
