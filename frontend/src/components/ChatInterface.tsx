import { useState, useRef, useEffect } from 'react'
import Header from './Header'
import Message from './Message'
import { Send, Loader2 } from 'lucide-react'
import axios from 'axios'

interface ToolCall {
  name: string
  input: Record<string, unknown>
  result: Record<string, unknown>
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  tools_used?: ToolCall[]
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const SUGGESTIONS = [
  'Quel est le PIB du Cameroun ?',
  'Quelle est la population actuelle ?',
  "Quel est le taux d'inflation ?",
  'Donne-moi les infos générales sur le Cameroun',
  'What is the unemployment rate in Cameroon?',
]

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text?: string) => {
    const userText = text || input.trim()
    if (!userText || loading) return

    const userMessage: ChatMessage = { role: 'user', content: userText }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const history = newMessages.slice(0, -1).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const { data } = await axios.post(`${API_URL}/mcp/chat`, {
        message: userText,
        history,
      })

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        tools_used: data.tools_used,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "❌ Erreur de connexion au serveur. Vérifiez que le backend tourne sur le port 8000.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <Header />

      {/* Zone messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                🇨🇲 eGov Cameroun
              </h2>
              <p className="text-gray-400 text-sm">
                Posez vos questions sur les données publiques du Cameroun
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 w-full max-w-lg">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors border border-gray-700 hover:border-gray-500"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <Message key={i} message={msg} />
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Loader2 className="animate-spin w-4 h-4" />
            <span>Analyse en cours...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Zone input */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex gap-2 items-end bg-gray-800 rounded-2xl px-4 py-3 border border-gray-700 focus-within:border-blue-500 transition-colors">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Posez votre question en français ou en anglais..."
            rows={1}
            className="flex-1 bg-transparent text-white placeholder-gray-500 resize-none outline-none text-sm"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-center text-gray-600 text-xs mt-2">
          Données en temps réel via World Bank API
        </p>
      </div>
    </div>
  )
}