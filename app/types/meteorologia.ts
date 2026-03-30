export type TipoEstacao = 'T' | 'M'

export interface Estacao {
  codigo: string
  nome: string
  estado: string
  municipio: string
  latitude: number
  longitude: number
  altitude: number
  tipo: TipoEstacao
  situacao: string
}

export interface DadosOpenMeteo {
  latitude: number
  longitude: number
  elevation: number
  timezone: string
  current: {
    time: string
    interval: number
    temperature_2m: number
    relative_humidity_2m: number
    precipitation: number
    weather_code: number
    wind_speed_10m: number
    wind_direction_10m: number
    surface_pressure: number
    apparent_temperature: number
    is_day: number
    cloud_cover: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    relative_humidity_2m: number[]
    precipitation_probability: number[]
    wind_speed_10m: number[]
    surface_pressure: number[]
  }
}

export interface DadosEstacao {
  estacao: Estacao
  meteorologia: {
    temperatura: number
    temperaturaAparente: number
    umidade: number
    precipitacao: number
    vento: {
      velocidade: number
      direcao: number
      direcaoTexto: string
    }
    pressao: number
    coberturaNuvens: number
    codigoTempo: number
    descricaoTempo: string
    ehDia: boolean
  }
  historico: {
    horas: string[]
    temperaturas: number[]
    umidades: number[]
    precipitacaoProbabilidade: number[]
    ventos: number[]
    pressoes: number[]
  }
  atualizadoEm: string
}

export interface RespostaEstacoes {
  total: number
  tipo: TipoEstacao
  estacoes: Estacao[]
}

export interface RespostaErro {
  erro: string
  detalhe?: string
}
