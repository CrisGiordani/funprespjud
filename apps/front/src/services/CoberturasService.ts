import { api } from '@/lib/api'
import type { CoberturaResponseType } from '@/types/coberturas/Coberturas.type'

export const CoberturasService = {
  getCoberturas: async (participantId: string) => {
    try {
      const response = await api.get<CoberturaResponseType>(`/participantes/${participantId}/coberturas-car`)

      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
