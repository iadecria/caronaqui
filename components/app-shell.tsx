"use client"

import { Header } from "./header"
import { BottomNav } from "./bottom-nav"
import { DesktopSidebar } from "./desktop-sidebar"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex flex-col h-[100dvh] bg-zinc-950">
      {/* Desktop Sidebar - visivel apenas no desktop */}
      <aside className="hidden md:block fixed inset-y-0 left-0 z-40 w-64">
        <DesktopSidebar />
      </aside>

      {/* Wrapper principal */}
      <div className="flex-1 flex flex-col md:ml-64 overflow-hidden">
        {/* Header mobile - apenas sino de notificacao */}
        <header className="md:hidden sticky top-0 z-40 flex-shrink-0">
          <Header />
        </header>

        {/* Conteudo rolavel - pb-16 exato para nao sobrepor o nav de 64px */}
        <main className="flex-1 overflow-y-auto overscroll-y-contain pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* Bottom Nav fixo - apenas mobile, altura exata de 64px (h-16) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </nav>
    </div>
  )
}
