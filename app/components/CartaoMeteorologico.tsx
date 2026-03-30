'use client'

import { DadosEstacao } from '../types/meteorologia'
import { Wind, Droplets, Gauge, Thermometer, Cloud, ArrowUp } from 'lucide-react'

interface Props {
  dados: DadosEstacao
  selecionado?: boolean
  onClick?: () => void
}

function corTemperatura(temp: number): string {
  if (temp <= 10) return 'text-blue-400'
  if (temp <= 18) return 'text-cyan-400'
  if (temp <= 24) return 'text-emerald-400'
  if (temp <= 30) return 'text-amber-400'
  if (temp <= 36) return 'text-orange-400'
  return 'text-red-400'
}

function iconeClima(codigo: number): string {
  if (codigo === 0) return '☀️'
  if (codigo <= 2) return '🌤️'
  if (codigo === 3) return '☁️'
  if (codigo <= 48) return '🌫️'
  if (codigo <= 67) return '🌧️'
  if (codigo <= 77) return '❄️'
  if (codigo <= 82) return '⛈️'
  return '⛈️'
}

export default function CartaoMeteorologico({ dados, selecionado, onClick }: Props) {
  const { estacao, meteorologia } = dados
  const corTemp = corTemperatura(meteorologia.temperatura)

  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-xl p-4 cursor-pointer transition-all duration-200
        border backdrop-blur-sm overflow-hidden
        ${selecionado
          ? 'border-blue-500 bg-blue-950/40 shadow-lg shadow-blue-500/20'
          : 'border-gray-700/60 bg-gray-800/40 hover:border-gray-500 hover:bg-gray-800/60'}
        animate-fade-in
      `}
    >
      {/* Indicador de seleção */}
      {selecionado && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500" />
      )}

      {/* Cabeçalho */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white text-sm leading-tight">{estacao.nome}</h3>
          <p className="text-gray-400 text-xs mt-0.5">{estacao.estado} · {estacao.altitude}m</p>
        </div>
        <span className="text-xl" title={meteorologia.descricaoTempo}>
          {iconeClima(meteorologia.codigoTempo)}
        </span>
      </div>

      {/* Temperatura principal */}
      <div className="mb-3">
        <div className={`text-3xl font-light tabular-nums ${corTemp}`}>
          {meteorologia.temperatura.toFixed(1)}
          <span className="text-lg text-gray-400">°C</span>
        </div>
        <p className="text-gray-500 text-xs mt-0.5">
          Sensação {meteorologia.temperaturaAparente.toFixed(1)}°C
        </p>
      </div>

      {/* Métricas secundárias */}
      <div className="grid grid-cols-2 gap-2">
        <MetricaMini
          icone={<Droplets size={12} />}
          valor={`${meteorologia.umidade}%`}
          rotulo="Umidade"
          cor="text-blue-400"
        />
        <MetricaMini
          icone={<Wind size={12} />}
          valor={`${meteorologia.vento.velocidade} km/h`}
          rotulo={meteorologia.vento.direcaoTexto}
          cor="text-teal-400"
        />
        <MetricaMini
          icone={<Gauge size={12} />}
          valor={`${meteorologia.pressao.toFixed(0)}`}
          rotulo="hPa"
          cor="text-purple-400"
        />
        <MetricaMini
          icone={<Cloud size={12} />}
          valor={`${meteorologia.coberturaNuvens}%`}
          rotulo="Nuvens"
          cor="text-gray-400"
        />
      </div>

      {/* Descrição do tempo */}
      <p className="mt-3 text-xs text-gray-500 truncate">{meteorologia.descricaoTempo}</p>
    </div>
  )
}

function MetricaMini({ icone, valor, rotulo, cor }: {
  icone: React.ReactNode; valor: string; rotulo: string; cor: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cor}>{icone}</span>
      <div>
        <span className="text-white text-xs font-medium">{valor}</span>
        <span className="text-gray-500 text-xs ml-1">{rotulo}</span>
      </div>
    </div>
  )
}
