import { useState, useRef, useEffect } from 'react'
import Header from './Header'
import Message from './Message'
import { Send, Loader2, Sparkles } from 'lucide-react'
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
  { icon: '📈', text: 'Quel est le PIB du Cameroun ?' },
  { icon: '👥', text: 'Quelle est la population actuelle ?' },
  { icon: '💰', text: "Quel est le taux d'inflation ?" },
  { icon: '🏛️', text: 'Donne-moi les infos générales sur le Cameroun' },
  { icon: '💼', text: 'What is the unemployment rate in Cameroon?' },
]

const LOADING_STEPS = [
  'Analyse de votre question...',
  'Sélection des outils MCP...',
  'Récupération des données World Bank...',
  'Formulation de la réponse...',
]

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const startProgress = () => {
    setProgress(0)
    setLoadingStep(0)
    let step = 0
    let prog = 0
    intervalRef.current = setInterval(() => {
      prog += 2
      if (prog <= 90) setProgress(prog)
      if (prog % 22 === 0 && step < LOADING_STEPS.length - 1) {
        step++
        setLoadingStep(step)
      }
    }, 200)
  }

  const stopProgress = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setProgress(100)
    setTimeout(() => setProgress(0), 500)
  }

  const sendMessage = async (text?: string) => {
    const userText = text || input.trim()
    if (!userText || loading) return

    const userMessage: ChatMessage = { role: 'user', content: userText }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    startProgress()

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
          content: '❌ Erreur de connexion. Vérifiez que le backend tourne.',
        },
      ])
    } finally {
      stopProgress()
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
    <div className="flex flex-col h-screen bg-gray-950">
      <Header />

      {/* Barre de progression */}
      {loading && (
        <div className="w-full h-1 bg-gray-800">
          <div
            className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Zone messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl w-full mx-auto">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-400" />
                <h2 className="text-3xl font-bold text-white">
                  eGov Cameroun
                </h2>
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-gray-400 text-sm max-w-md">
                Plateforme IA propulsée par MCP — Accédez aux données
                publiques du Cameroun en langage naturel
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.text}
                  onClick={() => sendMessage(s.text)}
                  className="flex items-center gap-3 text-left px-4 py-3 rounded-xl bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 text-sm transition-all border border-gray-700 hover:border-blue-500/50 hover:text-white group"
                >
                  <span className="text-xl">{s.icon}</span>
                  <span>{s.text}</span>
                </button>
              ))}
            </div>

            <p className="text-gray-600 text-xs">
              Données en temps réel · World Bank API · Bilingue FR/EN
            </p>
          </div>
        )}

        <div className="space-y-6">
          {messages.map((msg, i) => (
            <Message key={i} message={msg} />
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                <Loader2 className="animate-spin w-4 h-4 text-blue-400" />
              </div>
              <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 space-y-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <p className="text-gray-400 text-xs">
                  {LOADING_STEPS[loadingStep]}
                </p>
              </div>
            </div>
          )}
        </div>

        <div ref={bottomRef} />
      </div>

      {/* Zone input */}
      <div className="border-t border-gray-800 bg-gray-950 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 items-end bg-gray-800/50 rounded-2xl px-4 py-3 border border-gray-700 focus-within:border-blue-500/50 transition-colors">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Posez votre question en français ou en anglais..."
              rows={1}
              className="flex-1 bg-transparent text-white placeholder-gray-500 resize-none outline-none text-sm leading-relaxed"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-center text-gray-600 text-xs mt-2">
            Données World Bank · MCP Architecture · Claude Sonnet
          </p>
        </div>
      </div>
    </div>
  )
}