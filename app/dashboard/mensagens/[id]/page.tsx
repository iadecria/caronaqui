import { ChatWindow } from '@/components/chat/chat-window'

interface ChatPageProps {
  params: Promise<{ id: string }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params

  return (
    <div className="h-[100dvh] overflow-hidden">
      <ChatWindow conversationId={id} />
    </div>
  )
}
