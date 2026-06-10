import { Globe, Zap } from 'lucide-react'

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-900">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/20">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-none">
            Liwaza <span className="text-green-400">eGov</span>
          </h1>
          <p className="text-slate-400 text-xs">
            Plateforme IA — Données publiques Cameroun
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
        <Zap className="w-3 h-3 text-yellow-400" />
        <span className="text-slate-300 text-xs font-medium">MCP Active</span>
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      </div>
    </header>
  )
}