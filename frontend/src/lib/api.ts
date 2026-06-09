import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const API_KEY = import.meta.env.VITE_API_KEY || ''

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY && { 'X-API-Key': API_KEY }),
  },
})

export interface ToolCall {
  name: string
  input: Record<string, unknown>
  result: Record<string, unknown>
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  tools_used?: ToolCall[]
}

export interface ChatRequest {
  message: string
  history: { role: string; content: string }[]
}

export interface ChatResponse {
  response: string
  tools_used: ToolCall[]
}

export const sendMessage = async (
  message: string,
  history: ChatMessage[]
): Promise<ChatResponse> => {
  const { data } = await api.post<ChatResponse>('/mcp/chat', {
    message,
    history: history.map((m) => ({ role: m.role, content: m.content })),
  })
  return data
}

export const getTools = async () => {
  const { data } = await api.get('/mcp/tools')
  return data
}