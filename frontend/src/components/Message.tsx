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
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser
          ? 'bg-blue-600'
          : 'bg-gradient-to-br from-green-500 to-emerald-600'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      <div className={`max-w-[75%] space-y-2 flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-blue-600 text-white rounded-tr-sm'
            : 'bg-slate-800 text-slate-100 rounded-tl-sm border border-slate-700'
        }`}>
          {message.content}
        </div>

        {message.tools_used && message.tools_used.length > 0 && (
          <button
            onClick={() => setShowTools(!showTools)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-green-400 transition-colors"
          >
            {showTools ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {message.tools_used.length} outil(s) MCP utilisé(s)
          </button>
        )}

        {showTools && message.tools_used && (
          <div className="w-full space-y-2">
            {message.tools_used.map((tool, i) => (
              <div key={i} className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-green-400 font-mono font-bold">{tool.name}</span>
                </div>
                <pre className="text-slate-400 overflow-auto max-h-32 text-xs">
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