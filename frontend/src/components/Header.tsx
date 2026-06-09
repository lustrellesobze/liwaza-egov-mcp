import { Globe } from 'lucide-react'

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-blue-600">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-none">
            Liwaza eGov
          </h1>
          <p className="text-gray-400 text-xs">
            Plateforme IA — Données publiques Cameroun
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-gray-400 text-xs">World Bank API</span>
      </div>
    </header>
  )
}