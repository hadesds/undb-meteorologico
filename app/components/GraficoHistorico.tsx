'use client'

import { useState } from 'react'
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { DadosEstacao } from '../types/meteorologia'

type MetricaAtiva = 'temperatura' | 'umidade' | 'vento' | 'pressao'

interface Props {
  dados: DadosEstacao
}

const METRICAS = [
  { id: 'temperatura' as MetricaAtiva, rotulo: 'Temperatura', unidade: '°C', cor: '#F97316', tipo: 'area' },
  { id: 'umidade'    as MetricaAtiva, rotulo: 'Umidade',     unidade: '%',   cor: '#60A5FA', tipo: 'area' },
  { id: 'vento'      as MetricaAtiva, rotulo: 'Vento',       unidade: 'km/h',cor: '#34D399', tipo: 'line' },
  { id: 'pressao'    as MetricaAtiva, rotulo: 'Pressão',     unidade: 'hPa', cor: '#A78BFA', tipo: 'line' },
]

const TooltipPersonalizado = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const metrica = METRICAS.find(m => payload[0]?.dataKey?.startsWith(m.id))
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.value?.toFixed(1)} {metrica?.unidade}
        </p>
      ))}
    </div>
  )
}

export default function GraficoHistorico({ dados }: Props) {
  const [metricaAtiva, setMetricaAtiva] = useState<MetricaAtiva>('temperatura')
  const metrica = METRICAS.find(m => m.id === metricaAtiva)!

  const pontos = dados.historico.horas.map((hora, i) => ({
    hora,
    temperatura: dados.historico.temperaturas[i],
    umidade:     dados.historico.umidades[i],
    vento:       dados.historico.ventos[i],
    pressao:     dados.historico.pressoes[i],
  }))

  const valores = pontos.map(p => p[metricaAtiva] as number).filter(Boolean)
  const minVal = Math.floor(Math.min(...valores) * 0.98)
  const maxVal = Math.ceil(Math.max(...valores) * 1.02)

  return (
    <div className="bg-gray-800/40 border border-gray-700/60 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Histórico — {dados.estacao.nome}</h3>
          <p className="text-gray-500 text-xs mt-0.5">Próximas {pontos.length}h</p>
        </div>
        {/* Seletor de métrica */}
        <div className="flex gap-1 bg-gray-900/60 p-1 rounded-lg">
          {METRICAS.map(m => (
            <button
              key={m.id}
              onClick={() => setMetricaAtiva(m.id)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all duration-150 ${
                metricaAtiva === m.id
                  ? 'text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              style={metricaAtiva === m.id ? { backgroundColor: metrica.cor + '33', color: metrica.cor } : {}}
            >
              {m.rotulo}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        {metrica.tipo === 'area' ? (
          <AreaChart data={pontos} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${metricaAtiva}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={metrica.cor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={metrica.cor} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.5} />
            <XAxis dataKey="hora" tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} axisLine={false} domain={[minVal, maxVal]} />
            <Tooltip content={<TooltipPersonalizado />} />
            <Area
              type="monotone"
              dataKey={metricaAtiva}
              stroke={metrica.cor}
              strokeWidth={2}
              fill={`url(#grad-${metricaAtiva})`}
              dot={false}
              activeDot={{ r: 4, fill: metrica.cor, strokeWidth: 0 }}
            />
          </AreaChart>
        ) : (
          <LineChart data={pontos} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.5} />
            <XAxis dataKey="hora" tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} axisLine={false} domain={[minVal, maxVal]} />
            <Tooltip content={<TooltipPersonalizado />} />
            <Line
              type="monotone"
              dataKey={metricaAtiva}
              stroke={metrica.cor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: metrica.cor, strokeWidth: 0 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>

      <p className="text-gray-600 text-xs mt-2 text-right">
        Fonte: Open-Meteo · Atualizado {new Date(dados.atualizadoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  )
}
