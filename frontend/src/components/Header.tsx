import logo from '../assets/liwaza-logo.png'
import { Zap } from 'lucide-react'

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-slate-700 bg-slate-900">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Liwaza" className="h-8 brightness-0 invert" />
        <div className="border-l border-slate-600 pl-3">
          <p className="text-white font-semibold text-sm leading-none">eGov</p>
          <p className="text-slate-400 text-xs">Données publiques Cameroun</p>
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