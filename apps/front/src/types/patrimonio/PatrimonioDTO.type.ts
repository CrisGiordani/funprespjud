export type ContribuicaoDTO = {
  totalContribuido: number | null
  totalRentabilizado: number | null
  percentualRentabilidade: number | null
}

export type PatrimonioDTO = {
  patrimonioTotal: number | null
  totalContribuidoParticipante: number | null
  totalContribuidoPatrocinador: number | null
  totalContribuido: number | null
  rentabilidade: number | null
  rentabilidadePercentual: number | null
  aumentoPatrimonialParticipante: number | null
  aumentoPatrimonialParticipantePercentual: number | null
  contribuicaoNormalParticipanteRan: ContribuicaoDTO
  contribuicaoNormalPatrocinadorRan: ContribuicaoDTO
  contribuicaoNormalParticipanteRas: ContribuicaoDTO
}
