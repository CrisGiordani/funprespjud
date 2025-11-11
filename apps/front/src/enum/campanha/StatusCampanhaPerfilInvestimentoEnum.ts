export enum StatusCampanhaPerfilInvestimentoEnum {
  ANDAMENTO = 'andamento',
  FINALIZADA = 'finalizada',
  AGENDADA = 'agendada',
  NULL = 'null'
}

export const statusCampanhaMap = new Map<StatusCampanhaPerfilInvestimentoEnum, { label: string; color: string }>([
  [StatusCampanhaPerfilInvestimentoEnum.ANDAMENTO, { label: 'Em andamento', color: 'warning' }],
  [StatusCampanhaPerfilInvestimentoEnum.FINALIZADA, { label: 'Finalizada', color: 'success' }],
  [StatusCampanhaPerfilInvestimentoEnum.AGENDADA, { label: 'Agendada', color: 'info' }],
  [StatusCampanhaPerfilInvestimentoEnum.NULL, { label: '', color: 'default' }]
])