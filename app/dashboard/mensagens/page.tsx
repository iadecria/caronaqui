'use client'

import { ConversationList } from '@/components/chat/conversation-list'

export default function MensagensPage() {
  return (
    <div className="h-[100dvh] md:h-auto md:px-4 md:py-4 md:space-y-4 md:max-w-4xl md:mx-auto">
      <div className="hidden md:block px-4 pt-4">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Mensagens</h1>
        <p className="text-sm text-muted-foreground mt-1">Suas conversas com motoristas</p>
      </div>
      
      <div className="h-full md:rounded-xl md:border md:border-border md:bg-card md:overflow-hidden">
        <ConversationList />
      </div>
    </div>
  )
}
