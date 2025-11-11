export type DistribuicaoSolicitacoesType = {
  total: number
  horizonte2040: number
  horizonte2050: number
  horizonteProtegido: number
}

export type TotalDistribuicaoSolicitacoesType = {
  horizonte2040: DistribuicaoSolicitacoesType
  horizonte2050: DistribuicaoSolicitacoesType
  horizonteProtegido: DistribuicaoSolicitacoesType
}
