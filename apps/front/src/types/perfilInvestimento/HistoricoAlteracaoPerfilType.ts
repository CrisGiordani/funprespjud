import type { StatusHistoricoAlteracaoPerfilInvestimentoEnum } from '@/enum/perfilInvestimento/StatusHistoricoAlteracaoPerfilInvestimentoEnum'

export type HistoricoAlteracaoPerfilType = {
  perfilInvestimentoDescricao: string
  dt_solicitacao: string
  campanhaDescricao: string
  protocolo?: string
  status: StatusHistoricoAlteracaoPerfilInvestimentoEnum
  ativo?: boolean
}
