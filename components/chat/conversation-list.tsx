'use client'

import { Search, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { useState, useMemo } from 'react'
import { useMessages } from '@/contexts/messages-context'
import { useAuth } from '@/contexts/auth-context'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '@/components/ui/empty'
import { cn } from '@/lib/utils'

export function ConversationList() {
  const { conversations } = useMessages()
  const { user } = useAuth()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return conversations
    return conversations.filter(conv => {
      const otherName = user?.id === conv.passengerId ? conv.driverName : conv.passengerName
      return (
        otherName.toLowerCase().includes(search.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(search.toLowerCase())
      )
    })
  }, [conversations, search, user?.id])

  if (conversations.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessageCircle className="text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>Nenhuma conversa ainda</EmptyTitle>
          <EmptyDescription>
            Envie uma mensagem para um motorista para começar uma conversa.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/dashboard/buscar" className="text-primary underline underline-offset-4">
            Explorar caronas
          </Link>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Barra de busca */}
      <div className="p-4 border-b border-border sticky top-0 bg-card z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar conversa..."
            className="pl-9 h-10 bg-muted/50 border-border"
          />
        </div>
      </div>

      {/* Lista de conversas */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length > 0 ? (
          <div className="divide-y divide-border">
            {filtered.map(conv => {
              // Determina quem é o outro participante
              const isPassenger = user?.id === conv.passengerId
              const otherName = isPassenger ? conv.driverName : conv.passengerName
              const otherAvatar = isPassenger ? conv.driverAvatar : conv.passengerAvatar
              const isUnread = conv.unreadCount > 0

              return (
                <Link
                  key={conv.id}
                  href={`/dashboard/mensagens/${conv.id}`}
                  className={cn(
                    'block p-4 hover:bg-muted/30 transition-colors active:bg-muted/50',
                    isUnread && 'bg-primary/5'
                  )}
                >
                  <div className="flex gap-3 items-start">
                    {/* Avatar */}
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-border">
                      <Image
                        src={otherAvatar}
                        alt={otherName}
                        fill
                        className="object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>

                    {/* Conteudo */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className={cn(
                          'font-medium truncate',
                          isUnread ? 'text-foreground font-semibold' : 'text-foreground'
                        )}>
                          {otherName}
                        </p>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {new Date(conv.lastMessageTime).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {/* Preview da mensagem */}
                      <p className={cn(
                        'text-sm truncate mt-0.5 line-clamp-2',
                        isUnread
                          ? 'font-medium text-foreground'
                          : 'text-muted-foreground'
                      )}>
                        {conv.lastMessage}
                      </p>

                      {/* Badge de nao lido */}
                      {isUnread && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                            {conv.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-muted-foreground text-sm">Nenhuma conversa encontrada</p>
          </div>
        )}
      </div>
    </div>
  )
}
