
export const statusCampanha = {
  andamento: {
    label: 'Em andamento',
    color: 'warning'
  },
  finalizada: {
    label: 'Finalizada',
    color: 'success'
  },
  agendada: {
    label: 'Agendada',
    color: 'info'
  },
  null: {
    label: '',
    color: 'default'
  }
}

export type CampanhaType = {
  idCampanha?: number | string
  descricao: string
  dt_inicio: string
  usuario_criador?: string
  dt_fim: string
  status?: keyof typeof statusCampanha | null
}
export type CampanhaResponseType = {
  campanhas: CampanhaType[]

  pageIndex: number
  pageSize: number
  totalPages: number
  totalItems: number
}
