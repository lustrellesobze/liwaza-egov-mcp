import logo from '../assets/liwaza-logo.png'
import { Zap } from 'lucide-react'

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-900">
      <div className="flex items-center gap-2 ml-10 md:ml-0">
        <img src={logo} alt="Liwaza" className="h-6 brightness-0 invert" />
        <div className="border-l border-slate-600 pl-2">
          <p className="text-white font-semibold text-xs leading-none">eGov</p>
          <p className="text-slate-400 text-xs">Cameroun 🇨🇲</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
        <Zap className="w-3 h-3 text-yellow-400" />
        <span className="text-slate-300 text-xs font-medium">MCP</span>
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      </div>
    </header>
  )
}