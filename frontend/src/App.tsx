import { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import Sidebar from './components/Sidebar'

export interface Conversation {
  id: string
  title: string
  timestamp: Date
}

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string>('')

  const addConversation = (title: string) => {
    const id = Date.now().toString()
    const newConv: Conversation = {
      id,
      title: title.slice(0, 40) + (title.length > 40 ? '...' : ''),
      timestamp: new Date(),
    }
    setConversations((prev) => [newConv, ...prev])
    setActiveId(id)
  }

  const newChat = () => {
    setActiveId(Date.now().toString())
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950">
      <div className="w-64 h-full shrink-0 overflow-hidden">
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          onNew={newChat}
        />
      </div>
      <div className="flex-1 h-full overflow-hidden">
        <ChatInterface onFirstMessage={addConversation} />
      </div>
    </div>
  )
}

export default App