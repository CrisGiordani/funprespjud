import { api } from '@/lib/api'
import type { CotasType } from '@/types/cotas/CotasType'

export const CotasService = {
  getUltimaCota: async (cpf: string) => {
    const response = await api.get<CotasType>(`/cotas/atual/${cpf}`)

    return response.data
  }
}
