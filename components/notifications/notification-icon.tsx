'use client'

import { Bell, MessageCircle, Calendar, Star, Info, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNotifications, type NotificationType } from '@/contexts/notifications-context'
import { cn } from '@/lib/utils'
import Link from 'next/link'

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'reservation':
      return <Calendar className="h-4 w-4 text-primary" />
    case 'message':
      return <MessageCircle className="h-4 w-4 text-blue-500" />
    case 'reminder':
      return <Bell className="h-4 w-4 text-amber-500" />
    case 'rating':
      return <Star className="h-4 w-4 text-yellow-500" />
    case 'system':
      return <Info className="h-4 w-4 text-muted-foreground" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date()
  const date = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Agora'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
}

export function NotificationIcon() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const recentNotifications = notifications.slice(0, 5)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Notificacoes</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificacoes</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.preventDefault()
                markAllAsRead()
              }}
            >
              <Check className="h-3 w-3 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {recentNotifications.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Nenhuma notificacao
          </div>
        ) : (
          <>
            {recentNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 p-3 cursor-pointer",
                  !notification.read && "bg-primary/5"
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm truncate",
                    !notification.read && "font-medium"
                  )}>
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(notification.timestamp)}
                  </p>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="justify-center text-primary">
              <Link href="/dashboard/notificacoes">
                Ver todas as notificacoes
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
