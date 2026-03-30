import { Estacao, TipoEstacao } from '../types/meteorologia'

// Amostra representativa de estações do INMET distribuídas pelo Brasil
// Em produção, isso pode ser substituído por fetch à API do INMET
export const ESTACOES_BRASIL: Estacao[] = [
  // Norte
  { codigo: 'A101', nome: 'Manaus', estado: 'AM', municipio: 'Manaus', latitude: -3.103, longitude: -60.016, altitude: 61, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A102', nome: 'Belém', estado: 'PA', municipio: 'Belém', latitude: -1.443, longitude: -48.476, altitude: 24, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A103', nome: 'Porto Velho', estado: 'RO', municipio: 'Porto Velho', latitude: -8.759, longitude: -63.869, altitude: 94, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A104', nome: 'Boa Vista', estado: 'RR', municipio: 'Boa Vista', latitude: 2.819, longitude: -60.674, altitude: 90, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A105', nome: 'Macapá', estado: 'AP', municipio: 'Macapá', latitude: 0.034, longitude: -51.066, altitude: 14, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A106', nome: 'Rio Branco', estado: 'AC', municipio: 'Rio Branco', latitude: -9.974, longitude: -67.810, altitude: 153, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A107', nome: 'Palmas', estado: 'TO', municipio: 'Palmas', latitude: -10.184, longitude: -48.334, altitude: 278, tipo: 'T', situacao: 'Operante' },
  // Nordeste
  { codigo: 'A201', nome: 'São Luís', estado: 'MA', municipio: 'São Luís', latitude: -2.539, longitude: -44.280, altitude: 51, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A202', nome: 'Teresina', estado: 'PI', municipio: 'Teresina', latitude: -5.089, longitude: -42.810, altitude: 72, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A203', nome: 'Fortaleza', estado: 'CE', municipio: 'Fortaleza', latitude: -3.717, longitude: -38.543, altitude: 21, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A204', nome: 'Natal', estado: 'RN', municipio: 'Natal', latitude: -5.795, longitude: -35.209, altitude: 46, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A205', nome: 'João Pessoa', estado: 'PB', municipio: 'João Pessoa', latitude: -7.115, longitude: -34.877, altitude: 74, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A206', nome: 'Recife', estado: 'PE', municipio: 'Recife', latitude: -8.059, longitude: -34.880, altitude: 10, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A207', nome: 'Maceió', estado: 'AL', municipio: 'Maceió', latitude: -9.668, longitude: -35.735, altitude: 64, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A208', nome: 'Aracaju', estado: 'SE', municipio: 'Aracaju', latitude: -10.947, longitude: -37.073, altitude: 4, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A209', nome: 'Salvador', estado: 'BA', municipio: 'Salvador', latitude: -12.971, longitude: -38.501, altitude: 8, tipo: 'T', situacao: 'Operante' },
  // Centro-Oeste
  { codigo: 'A301', nome: 'Brasília', estado: 'DF', municipio: 'Brasília', latitude: -15.779, longitude: -47.929, altitude: 1159, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A302', nome: 'Goiânia', estado: 'GO', municipio: 'Goiânia', latitude: -16.686, longitude: -49.264, altitude: 741, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A303', nome: 'Campo Grande', estado: 'MS', municipio: 'Campo Grande', latitude: -20.469, longitude: -54.620, altitude: 530, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A304', nome: 'Cuiabá', estado: 'MT', municipio: 'Cuiabá', latitude: -15.601, longitude: -56.098, altitude: 166, tipo: 'T', situacao: 'Operante' },
  // Sudeste
  { codigo: 'A401', nome: 'São Paulo', estado: 'SP', municipio: 'São Paulo', latitude: -23.548, longitude: -46.636, altitude: 760, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A402', nome: 'Rio de Janeiro', estado: 'RJ', municipio: 'Rio de Janeiro', latitude: -22.903, longitude: -43.172, altitude: 11, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A403', nome: 'Belo Horizonte', estado: 'MG', municipio: 'Belo Horizonte', latitude: -19.919, longitude: -43.938, altitude: 858, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A404', nome: 'Vitória', estado: 'ES', municipio: 'Vitória', latitude: -20.315, longitude: -40.312, altitude: 8, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A405', nome: 'Campinas', estado: 'SP', municipio: 'Campinas', latitude: -22.905, longitude: -47.061, altitude: 686, tipo: 'T', situacao: 'Operante' },
  // Sul
  { codigo: 'A501', nome: 'Curitiba', estado: 'PR', municipio: 'Curitiba', latitude: -25.428, longitude: -49.273, altitude: 934, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A502', nome: 'Florianópolis', estado: 'SC', municipio: 'Florianópolis', latitude: -27.595, longitude: -48.548, altitude: 3, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A503', nome: 'Porto Alegre', estado: 'RS', municipio: 'Porto Alegre', latitude: -30.034, longitude: -51.217, altitude: 10, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A504', nome: 'Londrina', estado: 'PR', municipio: 'Londrina', latitude: -23.304, longitude: -51.167, altitude: 585, tipo: 'T', situacao: 'Operante' },
  { codigo: 'A505', nome: 'Caxias do Sul', estado: 'RS', municipio: 'Caxias do Sul', latitude: -29.168, longitude: -51.179, altitude: 759, tipo: 'T', situacao: 'Operante' },
  // Manuais extras
  { codigo: 'M001', nome: 'Santarém', estado: 'PA', municipio: 'Santarém', latitude: -2.443, longitude: -54.708, altitude: 55, tipo: 'M', situacao: 'Operante' },
  { codigo: 'M002', nome: 'Imperatriz', estado: 'MA', municipio: 'Imperatriz', latitude: -5.526, longitude: -47.492, altitude: 131, tipo: 'M', situacao: 'Operante' },
  { codigo: 'M003', nome: 'Uberlândia', estado: 'MG', municipio: 'Uberlândia', latitude: -18.918, longitude: -48.277, altitude: 863, tipo: 'M', situacao: 'Operante' },
  { codigo: 'M004', nome: 'Ribeirão Preto', estado: 'SP', municipio: 'Ribeirão Preto', latitude: -21.177, longitude: -47.810, altitude: 546, tipo: 'M', situacao: 'Operante' },
  { codigo: 'M005', nome: 'Pelotas', estado: 'RS', municipio: 'Pelotas', latitude: -31.771, longitude: -52.342, altitude: 7, tipo: 'M', situacao: 'Operante' },
]

export function buscarEstacoesPorTipo(tipo: TipoEstacao): Estacao[] {
  return ESTACOES_BRASIL.filter(e => e.tipo === tipo)
}

export function buscarEstaçaoPorCodigo(codigo: string): Estacao | undefined {
  return ESTACOES_BRASIL.find(e => e.codigo === codigo)
}
