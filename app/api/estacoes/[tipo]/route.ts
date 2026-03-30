import { NextRequest, NextResponse } from 'next/server'
import { buscarEstacoesPorTipo } from '../../../lib/estacoes'
import { TipoEstacao, RespostaErro, RespostaEstacoes } from '../../../types/meteorologia'

/**
 * GET /api/estacoes/[tipo]
 * Lista todas as estações por tipo: T (automáticas) ou M (manuais)
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { tipo: string } }
): Promise<NextResponse<RespostaEstacoes | RespostaErro>> {
  const tipo = params.tipo.toUpperCase()

  if (tipo !== 'T' && tipo !== 'M') {
    return NextResponse.json(
      { erro: 'Tipo inválido. Use T (automáticas) ou M (manuais).' },
      { status: 400 }
    )
  }

  const estacoes = buscarEstacoesPorTipo(tipo as TipoEstacao)

  return NextResponse.json(
    { total: estacoes.length, tipo: tipo as TipoEstacao, estacoes },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-Total-Estacoes': estacoes.length.toString(),
      },
    }
  )
}
