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

interface Props {
  onFirstMessage: (title: string) => void
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const SUGGESTIONS = [
  { icon: '📈', text: 'Quel est le PIB du Cameroun ?' },
  { icon: '👥', text: 'Quelle est la population actuelle ?' },
  { icon: '💰', text: "Quel est le taux d'inflation ?" },
  { icon: '🏛️', text: 'Infos générales sur le Cameroun' },
  { icon: '💼', text: 'What is the unemployment rate?' },
]

const LOADING_STEPS = [
  'Analyse de votre question...',
  'Sélection des outils MCP...',
  'Récupération des données World Bank...',
  'Formulation de la réponse...',
]

export default function ChatInterface({ onFirstMessage }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [firstSent, setFirstSent] = useState(false)
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
      prog += 1.5
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

    if (!firstSent) {
      setFirstSent(true)
      onFirstMessage(userText)
    }

    const userMessage: ChatMessage = { role: 'user', content: userText }
    setMessages((prev) => {
      const updated = [...prev, userMessage]
      return updated
    })
    setInput('')
    setLoading(true)
    startProgress()

    try {
      const currentMessages = messages
      const history = [...currentMessages].map((m) => ({
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
          content: 'Connection error. Please try again. .',
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
    <div className="flex flex-col h-full bg-slate-950">
      <Header />

      <div className="w-full h-0.5 bg-slate-800">
        {loading && (
          <div
            className="h-0.5 bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Comment puis-je vous aider ?
                  </h2>
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-slate-400 text-sm">
                  Posez vos questions sur les données publiques du Cameroun
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.text}
                    onClick={() => sendMessage(s.text)}
                    className="flex items-center gap-3 text-left px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-sm transition-all border border-slate-700 hover:border-green-500/40 hover:text-white"
                  >
                    <span className="text-xl shrink-0">{s.icon}</span>
                    <span className="leading-snug">{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {messages.map((msg, i) => (
              <Message key={i} message={msg} />
            ))}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0">
                  <Loader2 className="animate-spin w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 space-y-2 border border-slate-700">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <p className="text-slate-400 text-xs">{LOADING_STEPS[loadingStep]}</p>
                </div>
              </div>
            )}
          </div>

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-slate-700 bg-slate-900 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 items-end bg-slate-800 rounded-2xl px-4 py-3 border border-slate-700 focus-within:border-green-500/50 transition-colors">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Posez votre question en français ou en anglais..."
              rows={1}
              className="flex-1 bg-transparent text-white placeholder-slate-500 resize-none outline-none text-sm leading-relaxed"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-center text-slate-600 text-xs mt-2">
            World Bank API · MCP · Claude Sonnet · Données officielles
          </p>
        </div>
      </div>
    </div>
  )
}