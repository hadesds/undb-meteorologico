'use client'

import { DadosEstacao } from '../types/meteorologia'
import GraficoHistorico from './GraficoHistorico'
import { Wind, Droplets, Gauge, Thermometer, Cloud, MapPin, RefreshCw, Compass } from 'lucide-react'

interface Props {
  dados: DadosEstacao
  carregando?: boolean
  onAtualizar?: () => void
}

function BadgeInfo({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="bg-gray-900/60 rounded-lg px-3 py-2 text-center">
      <p className="text-gray-500 text-xs mb-0.5">{rotulo}</p>
      <p className="text-white font-medium text-sm">{valor}</p>
    </div>
  )
}

function Metrica({ icone, rotulo, valor, subvalor, cor }: {
  icone: React.ReactNode; rotulo: string; valor: string; subvalor?: string; cor: string
}) {
  return (
    <div className="bg-gray-900/40 border border-gray-700/40 rounded-xl p-4 flex items-center gap-3">
      <div className={`p-2 rounded-lg ${cor} bg-opacity-10`} style={{ backgroundColor: cor + '1A' }}>
        <span style={{ color: cor }}>{icone}</span>
      </div>
      <div>
        <p className="text-gray-400 text-xs">{rotulo}</p>
        <p className="text-white font-semibold text-base">{valor}</p>
        {subvalor && <p className="text-gray-500 text-xs mt-0.5">{subvalor}</p>}
      </div>
    </div>
  )
}

export default function PainelDetalhe({ dados, carregando, onAtualizar }: Props) {
  const { estacao, meteorologia } = dados
  const horaAtual = new Date(dados.atualizadoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Header da estação */}
      <div className="bg-gray-800/40 border border-gray-700/60 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={14} className="text-blue-400" />
              <span className="text-blue-400 text-xs font-medium uppercase tracking-wider">
                Estação {estacao.tipo === 'T' ? 'Automática' : 'Manual'} · {estacao.codigo}
              </span>
            </div>
            <h2 className="text-white text-2xl font-bold">{estacao.nome}</h2>
            <p className="text-gray-400 text-sm mt-0.5">
              {estacao.municipio}, {estacao.estado}
            </p>
          </div>
          <button
            onClick={onAtualizar}
            disabled={carregando}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-500 disabled:opacity-50"
          >
            <RefreshCw size={12} className={carregando ? 'animate-spin' : ''} />
            {carregando ? 'Atualizando...' : `Atualizado ${horaAtual}`}
          </button>
        </div>

        {/* Info geográfica */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <BadgeInfo rotulo="Latitude"  valor={`${estacao.latitude.toFixed(3)}°`} />
          <BadgeInfo rotulo="Longitude" valor={`${estacao.longitude.toFixed(3)}°`} />
          <BadgeInfo rotulo="Altitude"  valor={`${estacao.altitude} m`} />
        </div>
      </div>

      {/* Temperatura em destaque */}
      <div className="bg-gradient-to-br from-orange-950/30 via-gray-800/40 to-gray-800/40 border border-orange-900/30 rounded-xl p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Temperatura atual</p>
            <div className="text-6xl font-light text-orange-300 tabular-nums">
              {meteorologia.temperatura.toFixed(1)}
              <span className="text-2xl text-orange-500/60">°C</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Sensação térmica: <span className="text-orange-300">{meteorologia.temperaturaAparente.toFixed(1)}°C</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-5xl mb-2">
              {meteorologia.ehDia ? '☀️' : '🌙'}
            </p>
            <p className="text-gray-400 text-sm">{meteorologia.descricaoTempo}</p>
            <p className="text-gray-600 text-xs mt-1">{meteorologia.coberturaNuvens}% nuvens</p>
          </div>
        </div>
      </div>

      {/* Grid de métricas */}
      <div className="grid grid-cols-2 gap-3">
        <Metrica
          icone={<Droplets size={18} />}
          rotulo="Umidade relativa"
          valor={`${meteorologia.umidade}%`}
          cor="#60A5FA"
        />
        <Metrica
          icone={<Wind size={18} />}
          rotulo="Velocidade do vento"
          valor={`${meteorologia.vento.velocidade} km/h`}
          subvalor={`Direção: ${meteorologia.vento.direcaoTexto} (${meteorologia.vento.direcao}°)`}
          cor="#34D399"
        />
        <Metrica
          icone={<Gauge size={18} />}
          rotulo="Pressão atmosférica"
          valor={`${meteorologia.pressao.toFixed(0)} hPa`}
          cor="#A78BFA"
        />
        <Metrica
          icone={<Cloud size={18} />}
          rotulo="Precipitação"
          valor={`${meteorologia.precipitacao.toFixed(1)} mm`}
          subvalor={`${meteorologia.coberturaNuvens}% cobertura`}
          cor="#94A3B8"
        />
      </div>

      {/* Gráfico histórico */}
      <GraficoHistorico dados={dados} />
    </div>
  )
}
