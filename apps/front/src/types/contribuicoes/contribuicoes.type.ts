export type FilterContribuicoesType = {
  tipo?: string
  orgao?: string
  autor?: string
  dataInicial?: string
  dataFinal?: string
  pageIndex?: number
  pageSize?: number
}

export type ContribuicoesType = {
  participanteId: string
  filters?: FilterContribuicoesType
}

export type ContribuicaoResponseType = {
  patrocinador: string
  mesCompetencia: string
  anoCompetencia: string
  dtRecolhimento: string
  dtAporte: string
  contribuicao: string
  idContribuicao: string
  tipoContribuicao: string
  tipoValor: string
  contribuidor: string
  origemRecurso: string
  mantenedorConsolidado: string
  mantenedorContribuicao: string
  compoeIr: string
  valorContribuicao: number
  qtdCota: number
}

export type ContribuicaoDoMesType = {
  participanteId: string
}

export type ContribuicaoDoMesResponseType = {
  nomeMes?: string
  dataUltimoAporte: string
  mesAnoCompetencia: string
  contribuicaoTotal: number
  contribuicaoParticipante: number
  contribuicaoPatrocinador: number
}

export type PercentualContribuicaoType = {
  participanteId: string
}

export type PercentualContribuicaoResponseType = {
  percentualNormal: number
  percentualFacultativa: number
}
