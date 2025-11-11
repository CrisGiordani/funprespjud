import { api } from '@/lib/api'

export const PlanoService = {
  getPlanos: async (cpf: string, todosPlanos: boolean = false) => {
    try {
      const response = await api.get(`/participantes/${cpf}/planos`, {
        params: {
          all: todosPlanos
        }
      })

      return response
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
