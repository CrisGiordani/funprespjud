import { api } from '@/lib/api'

export const SaldoTotalService = {
  getSaldoTotal: async (participanteId: string) => {
    try {
      const response = await api.get(`/participante/${participanteId}/saldo`)

      return response.data.saldo
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
