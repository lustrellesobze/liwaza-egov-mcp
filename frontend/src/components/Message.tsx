import { User, Bot, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

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

export default function Message({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  const [showTools, setShowTools] = useState(false)

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-blue-600' : 'bg-gray-700'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Contenu */}
      <div className={`max-w-[75%] space-y-2 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-gray-800 text-gray-100 rounded-tl-sm'
          }`}
        >
          {message.content}
        </div>

        {/* Outils utilisés */}
        {message.tools_used && message.tools_used.length > 0 && (
          <button
            onClick={() => setShowTools(!showTools)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showTools ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
            {message.tools_used.length} outil(s) MCP utilisé(s)
          </button>
        )}

        {showTools && message.tools_used && (
          <div className="w-full space-y-2">
            {message.tools_used.map((tool, i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-green-400 font-mono font-bold">
                    {tool.name}
                  </span>
                </div>
                <pre className="text-gray-400 overflow-auto max-h-32 text-xs">
                  {JSON.stringify(tool.result, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}