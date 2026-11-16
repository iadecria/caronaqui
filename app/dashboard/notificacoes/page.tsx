'use client'

import { Bell, MessageCircle, Calendar, Star, Info, Trash2, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useNotifications, type NotificationType } from '@/contexts/notifications-context'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { NOTIFICATIONS, LABELS } from '@/lib/identity'

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'reservation':
      return <Calendar className="h-5 w-5 text-primary" />
    case 'message':
      return <MessageCircle className="h-5 w-5 text-blue-500" />
    case 'reminder':
      return <Bell className="h-5 w-5 text-amber-500" />
    case 'rating':
      return <Star className="h-5 w-5 text-yellow-500" />
    case 'system':
      return <Info className="h-5 w-5 text-muted-foreground" />
    default:
      return <Bell className="h-5 w-5" />
  }
}

function formatDateTime(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function NotificacoesPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications()

  return (
    <div className="px-4 py-4 md:px-6 md:py-6 space-y-4 md:space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Notificacoes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0 
              ? `Voce tem ${unreadCount} notificacao${unreadCount > 1 ? 'es' : ''} nao lida${unreadCount > 1 ? 's' : ''}`
              : 'Todas as notificacoes foram lidas'
            }
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="h-9">
              <CheckCheck className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Marcar como lidas</span>
              <span className="sm:hidden">Lidas</span>
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAll} className="h-9">
              <Trash2 className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Limpar</span>
            </Button>
          )}
        </div>
      </div>

      {/* Lista de Notificacoes */}
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-foreground mb-1">{NOTIFICATIONS.empty}</h3>
            <p className="text-sm text-muted-foreground">
              Quando tiver novidades, elas aparecem aqui.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "transition-colors",
                !notification.read && "border-primary/30 bg-primary/5"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-muted">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={cn(
                          "text-sm",
                          !notification.read && "font-semibold"
                        )}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDateTime(notification.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Marcar como lida
                        </Button>
                      )}
                      {notification.actionUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          asChild
                        >
                          <Link href={notification.actionUrl}>
                            Ver detalhes
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-destructive hover:text-destructive"
                        onClick={() => removeNotification(notification.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
