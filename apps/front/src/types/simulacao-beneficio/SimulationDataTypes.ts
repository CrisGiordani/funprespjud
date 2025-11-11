export type SimulationDataType = {
  participantData: Array<{
    icon: string
    label: string
    value: string
  }>
  additionalInfo: {
    baseContribuicao: string
    rentabilidade: string
    aporteExtraordinario: string
    prazoCerto: string
    saque: string
  }
  costPlan: Array<Array<string>>
}
