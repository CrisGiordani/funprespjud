import { api } from '@/lib/api'
import type { SimularBeneficiosResponseType } from '@/types/simulacao-beneficio/SimularBeneficiosResponseType'

export const SimularBeneficiosService = {
  getProjecaoBeneficio: async (participantId: string) => {
    try {
      const response = await api.get<SimularBeneficiosResponseType>(`/simulacoes/${participantId}/projecao-beneficio`)

      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
