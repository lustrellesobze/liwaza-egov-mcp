import { Plus, MessageSquare, Clock } from 'lucide-react'
import type { Conversation } from '../App'

interface Props {
  conversations: Conversation[]
  activeId: string
  onSelect: (id: string) => void
  onNew: () => void
}

export default function Sidebar({ conversations, activeId, onSelect, onNew }: Props) {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">Liwaza eGov</p>
            <p className="text-slate-500 text-xs">Cameroun 🇨🇲</p>
          </div>
        </div>
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-all hover:shadow-lg hover:shadow-green-500/20"
        >
          <Plus className="w-4 h-4" />
          Nouvelle conversation
        </button>
      </div>

      {/* Historique */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500 text-xs">
              Aucune conversation
            </p>
          </div>
        ) : (
          <>
            <p className="text-slate-500 text-xs px-2 mb-2 font-medium uppercase tracking-wider">
              Récent
            </p>
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all group ${
                  activeId === conv.id
                    ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span className="truncate leading-snug">{conv.title}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 ml-5">
                  <Clock className="w-2.5 h-2.5 text-slate-600" />
                  <span className="text-slate-600 text-xs">
                    {conv.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </button>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-slate-800">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-slate-400 text-xs">World Bank API</span>
        </div>
      </div>
    </div>
  )
}
