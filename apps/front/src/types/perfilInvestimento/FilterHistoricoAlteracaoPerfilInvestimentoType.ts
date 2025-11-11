import type { HistoricoAlteracaoPerfilType } from './HistoricoAlteracaoPerfilType'

export type FilterHistoricoAlteracaoPerfilInvestimentoType = {
  perfilInvestimentoHistorico: HistoricoAlteracaoPerfilType[]
  pageIndex: number
  pageSize: number
  totalPages: number
  totalItems: number
}
