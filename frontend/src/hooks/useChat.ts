import { useState } from 'react'
import { sendMessage } from '../lib/api'
import type { ChatMessage } from '../lib/api'

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const send = async (text: string) => {
    if (!text.trim() || loading) return

    const userMessage: ChatMessage = { role: 'user', content: text }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setLoading(true)
    setError(null)

    try {
      const data = await sendMessage(text, messages)
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        tools_used: data.tools_used,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setError('Erreur de connexion au serveur.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setMessages([])
    setError(null)
  }

  return { messages, loading, error, send, reset }
}