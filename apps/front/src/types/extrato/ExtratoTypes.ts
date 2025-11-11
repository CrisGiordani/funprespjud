export type CoberturaType = {
  nome: string
  valorSeguro: number
  mensalidade: number
}

export type CoberturasType = {
  morte: CoberturaType
  invalidez: CoberturaType
}

export type DatasType = {
  dataPagamento: string | null
  competencia: string
}

export type DetalhesMovimentacaoType = {
  coberturas: CoberturasType
  datas: DatasType
}

export type ExtratoTypes = {
  contribuidor: string
  patrocinador: string
  mantenedorContribuicao: string
  dtRecolhimento: string
  tipoContribuicao: string
  valorContribuicao: number
  taxaCarregamento: number
  fcbe: number
  car: number
  ran: number
  ras: number
  ranCotas: number
  rasCotas: number
  rentabilidade: number
  competencia: string
  mesCompetencia: string
  anoCompetencia: string
  grupoContribuicao: string
  detalhesMovimentacao?: DetalhesMovimentacaoType
  perfilAnterior?: PerfilInfo
  perfilNovo?: PerfilInfo
  dataTransferencia?: string
  isDeposito?: boolean
  isDebito?: boolean
  isSaldo?: boolean
}

export interface ExtratoApiResponse {
  pagina: number
  total_paginas: number
  total_itens: number
  itens_por_pagina: number
  dados: ExtratoTypes[]
}

export interface PerfilInfo {
  idPerfil: number
  nmPerfil: string
  valorCota: number
  RAN_participante: number
  RAN_patrocinador: number
  RAS_participante: number
}
