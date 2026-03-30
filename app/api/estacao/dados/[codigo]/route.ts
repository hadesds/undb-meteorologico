import { NextRequest, NextResponse } from 'next/server'
import { buscarEstaçaoPorCodigo } from '../../../../lib/estacoes'
import { buscarDadosMeteorologicos } from '../../../../lib/openmeteo'
import { DadosEstacao, RespostaErro } from '../../../../types/meteorologia'

/**
 * GET /api/estacao/dados/[codigo]
 * Retorna dados meteorológicos completos de uma estação via Open-Meteo
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { codigo: string } }
): Promise<NextResponse<DadosEstacao | RespostaErro>> {
  const codigo = params.codigo.toUpperCase()
  const estacao = buscarEstaçaoPorCodigo(codigo)

  if (!estacao) {
    return NextResponse.json(
      { erro: `Estação "${codigo}" não encontrada.` },
      { status: 404 }
    )
  }

  try {
    const dados = await buscarDadosMeteorologicos(estacao)
    return NextResponse.json(dados, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
        'X-Estacao-Codigo': estacao.codigo,
        'X-Estacao-Nome':   estacao.nome,
      },
    })
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido'
    return NextResponse.json(
      { erro: 'Falha ao consultar Open-Meteo', detalhe: mensagem },
      { status: 502 }
    )
  }
}
