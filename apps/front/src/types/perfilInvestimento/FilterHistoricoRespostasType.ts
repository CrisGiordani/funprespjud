import type { HistoricoRespostasType } from './HistoricoRespostasType'

export type FilterHistoricoRespostasType = {
  historico: HistoricoRespostasType[]
  pageIndex: number
  pageSize: number
  totalPages: number
  totalItems: number
}
