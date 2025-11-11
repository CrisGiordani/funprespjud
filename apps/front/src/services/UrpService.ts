import { api } from '@/lib/api'
import type { UrpResponseType } from '@/types/urp/urps.types'

export const UrpService = {
  getUrp: async (cpf: string): Promise<UrpResponseType> => {
    try {
      const response = await api.get(`/simulacoes/parametros/${cpf}/urps`)

      return response.data
    } catch (error) {
      throw error
    }
  }
}
