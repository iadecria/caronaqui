'use client'

import { Send, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useMessages } from '@/contexts/messages-context'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'

interface ChatWindowProps {
  conversationId: string
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { conversations, sendMessage } = useMessages()
  const [messageText, setMessageText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const conversation = conversations.find(c => c.id === conversationId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.lastMessageTime])

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-[100dvh] bg-background gap-4">
        <p className="text-muted-foreground">Conversa nao encontrada</p>
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          Voltar
        </Button>
      </div>
    )
  }

  // Determina quem eh o outro participante
  const isPassenger = user?.id === conversation.passengerId
  const otherName = isPassenger ? conversation.driverName : conversation.passengerName
  const otherAvatar = isPassenger ? conversation.driverAvatar : conversation.passengerAvatar
  const otherParticipantId = isPassenger ? conversation.driverId : conversation.passengerId

  const handleSend = async () => {
    if (!messageText.trim()) return
    setIsSending(true)
    await sendMessage(conversationId, messageText)
    setMessageText('')
    setIsSending(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 p-4 border-b border-border bg-card sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-border">
            <Image
              src={otherAvatar}
              alt={otherName}
              fill
              className="object-cover"
              crossOrigin="anonymous"
            />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{otherName}</p>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!conversation.lastMessage ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">Comece a conversa!</p>
          </div>
        ) : (
          <>
            <div className="flex gap-2 justify-start">
              <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-border">
                <Image
                  src={otherAvatar}
                  alt={otherName}
                  fill
                  className="object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="max-w-xs px-4 py-2 rounded-2xl bg-muted text-foreground">
                <p className="text-sm leading-relaxed break-words">{conversation.lastMessage}</p>
                <p className="text-xs mt-1 text-muted-foreground">
                  {new Date(conversation.lastMessageTime).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card sticky bottom-0">
        <div className="flex gap-2">
          <textarea
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            rows={1}
            className={cn(
              'flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2.5',
              'text-sm leading-relaxed placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow',
              'max-h-24'
            )}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!messageText.trim() || isSending}
            className="h-10 w-10 flex-shrink-0"
          >
            {isSending ? (
              <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
