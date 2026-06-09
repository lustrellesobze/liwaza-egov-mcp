import { ChevronDown, ChevronUp, Zap } from 'lucide-react'
import { useState } from 'react'
import { ToolCall } from '../lib/api'

interface Props {
  tools: ToolCall[]
}

export default function ToolExecution({ tools }: Props) {
  const [open, setOpen] = useState(false)

  if (!tools || tools.length === 0) return null

  return (
    <div className="mt-2 w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
      >
        <Zap className="w-3 h-3 text-yellow-400" />
        <span>{tools.length} outil(s) MCP exécuté(s)</span>
        {open ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </button>

      {open && (
        <div className="mt-2 space-y-2">
          {tools.map((tool, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-700 rounded-xl p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-green-400 font-mono text-xs font-bold">
                  {tool.name}
                </span>
              </div>
              <div className="text-xs text-gray-500 mb-1">Paramètres :</div>
              <pre className="text-gray-400 text-xs overflow-auto max-h-20 mb-2">
                {JSON.stringify(tool.input, null, 2)}
              </pre>
              <div className="text-xs text-gray-500 mb-1">Résultat :</div>
              <pre className="text-gray-400 text-xs overflow-auto max-h-32">
                {JSON.stringify(tool.result, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}