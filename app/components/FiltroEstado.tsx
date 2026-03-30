'use client'

import { Estacao } from '../types/meteorologia'

interface Props {
  estacoes: Estacao[]
  estadoAtivo: string | null
  onSelecionar: (estado: string | null) => void
}

export default function FiltroEstado({ estacoes, estadoAtivo, onSelecionar }: Props) {
  const estados = Array.from(new Set(estacoes.map(e => e.estado))).sort()

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <button
        onClick={() => onSelecionar(null)}
        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
          estadoAtivo === null
            ? 'bg-blue-600 text-white'
            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
        }`}
      >
        Todos
      </button>
      {estados.map(estado => (
        <button
          key={estado}
          onClick={() => onSelecionar(estado === estadoAtivo ? null : estado)}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
            estadoAtivo === estado
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
          }`}
        >
          {estado}
        </button>
      ))}
    </div>
  )
}
