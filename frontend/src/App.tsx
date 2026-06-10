import { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import Sidebar from './components/Sidebar'
import { Menu, X } from 'lucide-react'

export interface Conversation {
  id: string
  title: string
  timestamp: Date
}

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-30 h-full w-64 shrink-0 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={(id) => { setActiveId(id); setSidebarOpen(false) }}
          onNew={newChat}
        />
      </div>

      {/* Main */}
      <div className="flex-1 h-full overflow-hidden flex flex-col">
        {/* Bouton hamburger mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden absolute top-3 left-3 z-10 p-2 rounded-lg bg-slate-800 text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <ChatInterface onFirstMessage={addConversation} />
      </div>
    </div>
  )
}

export default App