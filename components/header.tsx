"use client"

import { useAuth } from "@/contexts/auth-context"
import { Logo } from "./logo"
import { NotificationIcon } from "@/components/notifications/notification-icon"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
      <div className="flex items-center justify-between px-4 h-14 max-w-screen-sm mx-auto">
        <Logo size="sm" />
        
        <div className="flex items-center gap-3">
          <NotificationIcon />
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-9 w-9 rounded-full p-0"
                >
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">{user.name}</span>
                  <span className="text-xs text-zinc-400 font-normal">{user.email}</span>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <button className="w-full cursor-pointer flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Meu Perfil</span>
                  </button>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <button 
                    onClick={logout}
                    className="w-full cursor-pointer flex items-center gap-2 text-red-500 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
