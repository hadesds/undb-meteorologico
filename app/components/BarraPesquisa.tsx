'use client'

import { useState, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { Estacao } from '../types/meteorologia'

interface Props {
  estacoes: Estacao[]
  onSelecionar: (estacao: Estacao) => void
  codigoAtivo?: string
}

export default function BarraPesquisa({ estacoes, onSelecionar, codigoAtivo }: Props) {
  const [busca, setBusca] = useState('')
  const [aberta, setAberta] = useState(false)

  const resultados = busca.length >= 2
    ? estacoes.filter(e =>
        e.nome.toLowerCase().includes(busca.toLowerCase()) ||
        e.estado.toLowerCase().includes(busca.toLowerCase()) ||
        e.municipio.toLowerCase().includes(busca.toLowerCase()) ||
        e.codigo.toLowerCase().includes(busca.toLowerCase())
      ).slice(0, 8)
    : []

  const selecionar = useCallback((estacao: Estacao) => {
    onSelecionar(estacao)
    setBusca('')
    setAberta(false)
  }, [onSelecionar])

  return (
    <div className="relative w-full max-w-sm">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={busca}
          onChange={e => { setBusca(e.target.value); setAberta(true) }}
          onFocus={() => setAberta(true)}
          placeholder="Buscar estação, cidade ou estado..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-8 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        {busca && (
          <button
            onClick={() => { setBusca(''); setAberta(false) }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {aberta && resultados.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          {resultados.map(estacao => (
            <button
              key={estacao.codigo}
              onClick={() => selecionar(estacao)}
              className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-gray-800 transition-colors ${
                codigoAtivo === estacao.codigo ? 'bg-blue-950/40 text-blue-300' : 'text-gray-200'
              }`}
            >
              <div>
                <span className="text-sm font-medium">{estacao.nome}</span>
                <span className="text-gray-500 text-xs ml-2">{estacao.estado}</span>
              </div>
              <span className="text-gray-600 text-xs font-mono">{estacao.codigo}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
