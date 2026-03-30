'use client'

import { useState, useEffect, useCallback } from 'react'
import { Estacao, DadosEstacao, TipoEstacao } from '../types/meteorologia'
import CartaoMeteorologico from '../components/CartaoMeteorologico'
import PainelDetalhe from '../components/PainelDetalhe'
import BarraPesquisa from '../components/BarraPesquisa'
import FiltroEstado from '../components/FiltroEstado'
import { RefreshCw, Radio, Satellite } from 'lucide-react'

// Busca a lista de estações da API Route (servidor)
async function carregarEstacoes(tipo: TipoEstacao): Promise<Estacao[]> {
  const res = await fetch(`/api/estacoes/${tipo}`)
  if (!res.ok) throw new Error('Falha ao carregar estações')
  const dados = await res.json()
  return dados.estacoes as Estacao[]
}

// Busca dados meteorológicos de uma estação via API Route proxy
async function carregarDadosEstacao(codigo: string): Promise<DadosEstacao> {
  const res = await fetch(`/api/estacao/dados/${codigo}`)
  if (!res.ok) throw new Error('Falha ao carregar dados da estação')
  return res.json() as Promise<DadosEstacao>
}

// Carrega várias estações em paralelo (limitado a 6 por vez)
async function carregarMultiplasEstacoes(estacoes: Estacao[]): Promise<DadosEstacao[]> {
  const lote = estacoes.slice(0, 6)
  const resultados = await Promise.allSettled(
    lote.map(e => carregarDadosEstacao(e.codigo))
  )
  return resultados
    .filter((r): r is PromiseFulfilledResult<DadosEstacao> => r.status === 'fulfilled')
    .map(r => r.value)
}

export default function DashboardPage() {
  const [tipoEstacao, setTipoEstacao] = useState<TipoEstacao>('T')
  const [todasEstacoes, setTodasEstacoes] = useState<Estacao[]>([])
  const [estadoFiltro, setEstadoFiltro] = useState<string | null>(null)
  const [dadosCarregados, setDadosCarregados] = useState<DadosEstacao[]>([])
  const [estacaoSelecionada, setEstacaoSelecionada] = useState<DadosEstacao | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  // Carrega a lista inicial de estações
  useEffect(() => {
    setCarregando(true)
    setErro(null)
    carregarEstacoes(tipoEstacao)
      .then(async estacoes => {
        setTodasEstacoes(estacoes)
        const dados = await carregarMultiplasEstacoes(estacoes)
        setDadosCarregados(dados)
        if (dados.length > 0 && !estacaoSelecionada) {
          setEstacaoSelecionada(dados[0])
        }
      })
      .catch(e => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [tipoEstacao])

  // Seleciona uma estação e busca seus dados
  const selecionarEstacao = useCallback(async (estacao: Estacao) => {
    // Verifica se já carregamos os dados dela
    const jaCarregado = dadosCarregados.find(d => d.estacao.codigo === estacao.codigo)
    if (jaCarregado) {
      setEstacaoSelecionada(jaCarregado)
      return
    }
    // Caso contrário, busca via API Route
    setCarregandoDetalhe(true)
    try {
      const dados = await carregarDadosEstacao(estacao.codigo)
      setDadosCarregados(prev => [...prev.filter(d => d.estacao.codigo !== estacao.codigo), dados])
      setEstacaoSelecionada(dados)
    } catch (e) {
      console.error('Erro ao carregar estação:', e)
    } finally {
      setCarregandoDetalhe(false)
    }
  }, [dadosCarregados])

  // Atualiza a estação selecionada
  const atualizarSelecionada = useCallback(async () => {
    if (!estacaoSelecionada) return
    setCarregandoDetalhe(true)
    try {
      const dados = await carregarDadosEstacao(estacaoSelecionada.estacao.codigo)
      setDadosCarregados(prev => prev.map(d =>
        d.estacao.codigo === dados.estacao.codigo ? dados : d
      ))
      setEstacaoSelecionada(dados)
    } finally {
      setCarregandoDetalhe(false)
    }
  }, [estacaoSelecionada])

  // Filtra os cartões exibidos
  const dadosFiltrados = dadosCarregados.filter(d =>
    !estadoFiltro || d.estacao.estado === estadoFiltro
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Barra de navegação superior */}
      <header className="border-b border-gray-800/80 bg-gray-950/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
          {/* Logo / Título */}
          <div className="flex items-center gap-2.5 mr-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Satellite size={14} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-none">MeteoNet BR</h1>
              <p className="text-gray-500 text-xs leading-none mt-0.5">Open-Meteo · Brasil</p>
            </div>
          </div>

          {/* Toggle tipo estação */}
          <div className="flex gap-1 bg-gray-800/60 p-1 rounded-lg">
            <button
              onClick={() => setTipoEstacao('T')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                tipoEstacao === 'T'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Satellite size={12} />
              Automáticas
            </button>
            <button
              onClick={() => setTipoEstacao('M')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                tipoEstacao === 'M'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Radio size={12} />
              Manuais
            </button>
          </div>

          {/* Barra de busca */}
          <div className="flex-1 min-w-[200px]">
            <BarraPesquisa
              estacoes={todasEstacoes}
              onSelecionar={selecionarEstacao}
              codigoAtivo={estacaoSelecionada?.estacao.codigo}
            />
          </div>

          {/* Contadores */}
          <div className="text-xs text-gray-500 ml-auto hidden sm:block">
            <span className="text-white font-medium">{dadosFiltrados.length}</span> de{' '}
            <span className="text-white font-medium">{todasEstacoes.length}</span> estações
          </div>
        </div>

        {/* Filtro por estado */}
        <div className="max-w-[1600px] mx-auto px-4 pb-2.5 overflow-x-auto">
          <FiltroEstado
            estacoes={todasEstacoes}
            estadoAtivo={estadoFiltro}
            onSelecionar={setEstadoFiltro}
          />
        </div>
      </header>

      {/* Layout principal: sidebar + painel detalhe */}
      <main className="max-w-[1600px] mx-auto px-4 py-4 flex gap-4 items-start">
        {/* Sidebar: lista de cartões */}
        <aside className="w-80 shrink-0 space-y-2 overflow-y-auto max-h-[calc(100vh-120px)] pr-1">
          {carregando ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-36 rounded-xl bg-gray-800/40 animate-pulse" />
              ))}
            </div>
          ) : erro ? (
            <div className="text-red-400 text-sm bg-red-950/30 border border-red-900/40 rounded-xl p-4">
              <p className="font-medium mb-1">Erro ao carregar</p>
              <p className="text-red-400/70 text-xs">{erro}</p>
            </div>
          ) : dadosFiltrados.length === 0 ? (
            <div className="text-gray-500 text-sm text-center py-8">
              Nenhuma estação encontrada
            </div>
          ) : (
            dadosFiltrados.map(dados => (
              <CartaoMeteorologico
                key={dados.estacao.codigo}
                dados={dados}
                selecionado={estacaoSelecionada?.estacao.codigo === dados.estacao.codigo}
                onClick={() => setEstacaoSelecionada(dados)}
              />
            ))
          )}
        </aside>

        {/* Painel de detalhe */}
        <div className="flex-1 min-w-0">
          {estacaoSelecionada ? (
            <PainelDetalhe
              dados={estacaoSelecionada}
              carregando={carregandoDetalhe}
              onAtualizar={atualizarSelecionada}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-600">
              <Satellite size={40} className="mb-3 opacity-40" />
              <p className="text-sm">Selecione uma estação para ver os detalhes</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
