export type MigracaoSolicitacoesType = {
  solicitacoesProcessadas: {
    id: number
    idTrust: number
    cpf: string
    status: string
    email: string
    dt_solicitacao: string
    ativo: boolean
    protocolo: string
    perfilInvestimentoDescricao: string
    url: string
  }[]
  solicitacoesProcessadasTotal: number
  solicitacoesInconsistentes: {
    id: number
    idTrust: number
    cpf: string
    status: string
    email: string
    dt_solicitacao: string
    ativo: boolean
    protocolo: string
    perfilInvestimentoDescricao: string
    url: string
  }[]
  solicitacoesInconsistentesTotal: number
}
