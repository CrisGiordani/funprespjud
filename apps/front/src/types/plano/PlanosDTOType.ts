import type { PlanoDTOType } from './PlanoDTOType'

export type PlanosDTOType = {
  success: boolean
  message: string
  data: PlanoDTOType[]
  metadata: {
    timestamp: string
    totalItems: number
    version: string
    endpoint: string
    method: string
  }
}
