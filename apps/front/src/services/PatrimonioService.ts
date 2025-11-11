import { api } from '@/lib/api'
import type { EvolucaoAnualDTO } from '@/types/patrimonio/EvolucaoAnualDTO.type'
import type { EvolucaoMensalDTO } from '@/types/patrimonio/EvolucaoMensalDTO.type'
import type { PatrimonioDTO } from '@/types/patrimonio/PatrimonioDTO.type'

export const PatrimonioService = {
  getPatrimonio: async (participantId: string) => {
    try {
      const response = await api.get<{ patrimonio: PatrimonioDTO }>(`/patrimonio/${participantId}/`)

      return response.data.patrimonio
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  getEvolucaoAnual: async (participantId: string) => {
    try {
      const response = await api.get<{ patrimonioEvolucaoAnual: EvolucaoAnualDTO[] }>(
        `/patrimonio/${participantId}/evolucao-anual`
      )

      return response.data.patrimonioEvolucaoAnual
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  getEvolucaoUltimoAno: async (participantId: string) => {
    try {
      const response = await api.get(`/patrimonio/${participantId}/evolucao-mensal-ultimo-ano`)

      const values = response.data.patrimonioEvolucaoMensalUltimoAno
      const dataFormatted = Object.values(values) as EvolucaoMensalDTO[]

      return dataFormatted
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  getEvolucaoUltimo12Meses: async (participantId: string) => {
    try {
      const response = await api.get(`/patrimonio/${participantId}/evolucao-mensal-ultimos-doze-meses`)

      const values = response.data.patrimonioEvolucaoMensalUltimosDozeMeses
      const dataFormatted = Object.values(values) as EvolucaoMensalDTO[]

      return dataFormatted
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  getVariacaoPatrimonioRetornoInvestimento: async (cpf: string) => {
    const response = await api.get(`/patrimonio/${cpf}/dados-anuais`)

    return response.data
  }
}
