import { api } from '../lib/api'

import type { SimulacaoSimplificadaNormalResponse } from '@/types/simulacao-beneficio/SimulacaoSimplificadaNormalType'


export const SimuladorService = {
  getSimulacaoSimplificadaPerfilDeInvestimento: async (cpf: string, idPerfil: string | number | null = null) => {
    try {
      const response = await api.get(`/simulacoes/parametros/predefinidos/${cpf}/${idPerfil}`, {})

      return response
    } catch (error) {
      throw error
    }
  },

  getUltimoHistoricoSalario: async (cpf: string) => {
    try {
      const response = await api.get<{ ultimoHistoricoSalario: number }>(
        `/simulacoes/parametros/${cpf}/ultimo-historico-salario`
      )

      return response
    } catch (error) {
      throw error
    }
  },

  getSimulacaoSimplificadaNormal: async (cpf: string) => {
    try {
      const response = await api.get(`/simulacoes/${cpf}/simplificada-normal`)

      return response as unknown as SimulacaoSimplificadaNormalResponse
    } catch (error) {
      throw error
    }
  },

  getRentabilidadeProjetada: async (cpf: string): Promise<number> => {
    try {
      interface RentabilidadeProjetadaResponse {
        success: boolean
        message: string
        data: {
          rentabilidadeProjetada: number
        }
        metadata: {
          timestamp: string
        }
      }

      const response = await api.get<RentabilidadeProjetadaResponse>(`/simulacoes/${cpf}/rentabilidade-projetada`)

      return response.data.data.rentabilidadeProjetada
    } catch (error) {
      console.error('Erro ao buscar rentabilidade projetada:', error)
      throw error
    }
  }
}
