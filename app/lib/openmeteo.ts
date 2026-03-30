import { DadosOpenMeteo, DadosEstacao, Estacao } from '../types/meteorologia'

const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

// Variáveis solicitadas à API
const VARIAVEIS_ATUAIS = [
  'temperature_2m', 'relative_humidity_2m', 'precipitation',
  'weather_code', 'wind_speed_10m', 'wind_direction_10m',
  'surface_pressure', 'apparent_temperature', 'is_day', 'cloud_cover',
].join(',')

const VARIAVEIS_HORARIAS = [
  'temperature_2m', 'relative_humidity_2m',
  'precipitation_probability', 'wind_speed_10m', 'surface_pressure',
].join(',')

export async function buscarDadosMeteorologicos(estacao: Estacao): Promise<DadosEstacao> {
  const url = new URL(BASE_URL)
  url.searchParams.set('latitude',        estacao.latitude.toString())
  url.searchParams.set('longitude',       estacao.longitude.toString())
  url.searchParams.set('current',         VARIAVEIS_ATUAIS)
  url.searchParams.set('hourly',          VARIAVEIS_HORARIAS)
  url.searchParams.set('timezone',        'America/Sao_Paulo')
  url.searchParams.set('forecast_days',   '1')
  url.searchParams.set('wind_speed_unit', 'kmh')
  url.searchParams.set('temperature_unit','celsius')

  const resposta = await fetch(url.toString(), {
    next: { revalidate: 600 }, // cache por 10 min
  })

  if (!resposta.ok) {
    throw new Error(`Open-Meteo retornou ${resposta.status}: ${resposta.statusText}`)
  }

  const dados: DadosOpenMeteo = await resposta.json()
  return transformarDados(estacao, dados)
}

function traduzirDirecaoVento(graus: number): string {
  const direcoes = ['N','NNE','NE','ENE','L','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO']
  const indice = Math.round(graus / 22.5) % 16
  return direcoes[indice]
}

function traduzirCodigoTempo(codigo: number, ehDia: boolean): string {
  const tabela: Record<number, string> = {
    0: 'Céu limpo', 1: 'Principalmente limpo', 2: 'Parcialmente nublado',
    3: 'Nublado', 45: 'Névoa', 48: 'Névoa com gelo',
    51: 'Chuvisco leve', 53: 'Chuvisco moderado', 55: 'Chuvisco intenso',
    61: 'Chuva leve', 63: 'Chuva moderada', 65: 'Chuva forte',
    71: 'Neve leve', 73: 'Neve moderada', 75: 'Neve forte',
    77: 'Granizo', 80: 'Pancadas leves', 81: 'Pancadas moderadas',
    82: 'Pancadas fortes', 85: 'Nevadas leves', 86: 'Nevadas fortes',
    95: 'Tempestade', 96: 'Tempestade com granizo', 99: 'Tempestade intensa',
  }
  return tabela[codigo] ?? (ehDia ? 'Parcialmente nublado' : 'Noite nublada')
}

function transformarDados(estacao: Estacao, dados: DadosOpenMeteo): DadosEstacao {
  const c = dados.current
  const h = dados.hourly
  const ehDia = c.is_day === 1

  // Pega apenas as próximas 24h de dados horários
  const agora = new Date()
  const horasFormatadas = h.time.map((t, i) => {
    const dt = new Date(t)
    const hh = dt.getHours().toString().padStart(2, '0')
    return { hora: `${hh}h`, temperatura: h.temperature_2m[i], umidade: h.relative_humidity_2m[i],
      precipitacao: h.precipitation_probability[i], vento: h.wind_speed_10m[i], pressao: h.surface_pressure[i],
      timestamp: dt.getTime() }
  }).filter(d => d.timestamp >= agora.getTime()).slice(0, 24)

  return {
    estacao,
    meteorologia: {
      temperatura:         parseFloat(c.temperature_2m.toFixed(1)),
      temperaturaAparente: parseFloat(c.apparent_temperature.toFixed(1)),
      umidade:             c.relative_humidity_2m,
      precipitacao:        parseFloat(c.precipitation.toFixed(1)),
      vento: {
        velocidade: parseFloat(c.wind_speed_10m.toFixed(1)),
        direcao:    c.wind_direction_10m,
        direcaoTexto: traduzirDirecaoVento(c.wind_direction_10m),
      },
      pressao:          parseFloat(c.surface_pressure.toFixed(1)),
      coberturaNuvens:  c.cloud_cover,
      codigoTempo:      c.weather_code,
      descricaoTempo:   traduzirCodigoTempo(c.weather_code, ehDia),
      ehDia,
    },
    historico: {
      horas:          horasFormatadas.map(d => d.hora),
      temperaturas:   horasFormatadas.map(d => d.temperatura),
      umidades:       horasFormatadas.map(d => d.umidade),
      precipitacaoProbabilidade: horasFormatadas.map(d => d.precipitacao),
      ventos:         horasFormatadas.map(d => d.vento),
      pressoes:       horasFormatadas.map(d => d.pressao),
    },
    atualizadoEm: new Date().toISOString(),
  }
}
