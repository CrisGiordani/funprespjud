import { api } from '@/lib/api'

import type { ExtratoTypes } from '@/types/extrato/ExtratoTypes'
import type { FilterExtratoType } from '@/types/extrato/FilterExtratoType'

interface ExtratoResponse {
  pagina: number
  total_paginas: number
  total_itens: number
  itens_por_pagina: number
  dados: ExtratoTypes[] | Record<string, ExtratoTypes>
}

export const ExtratoService = {
  getAllExtrato: async (filters: FilterExtratoType, cpf: string) => {
    try {
      // Construir parâmetros apenas com valores válidos
      const params: Record<string, any> = {
        pageIndex: filters.pageIndex,
        pageSize: filters.pageSize
      }

      // Adicionar dataInicial se mês ou ano estiverem preenchidos
      if (filters.mesInicial || filters.anoInicial) {
        if (filters.mesInicial && filters.anoInicial) {
          params.dataInicial = `${filters.mesInicial}/${filters.anoInicial}`
        } else if (filters.mesInicial) {
          params.dataInicial = filters.mesInicial
        } else if (filters.anoInicial) {
          params.dataInicial = filters.anoInicial
        }
      }

      // Adicionar dataFinal se mês ou ano estiverem preenchidos
      if (filters.mesFinal || filters.anoFinal) {
        if (filters.mesFinal && filters.anoFinal) {
          params.dataFinal = `${filters.mesFinal}/${filters.anoFinal}`
        } else if (filters.mesFinal) {
          params.dataFinal = filters.mesFinal
        } else if (filters.anoFinal) {
          params.dataFinal = filters.anoFinal
        }
      }

      // Adicionar outros filtros apenas se estiverem preenchidos
      if (filters.tipo) params.tipo = filters.tipo
      if (filters.orgao) params.orgao = filters.orgao
      if (filters.autor) params.autor = filters.autor

      const response = await api.get<ExtratoResponse>(`/participante/${cpf}/extrato`, { params })

      // Normalizar para array
      const dados = Array.isArray(response.data.dados) ? response.data.dados : Object.values(response.data.dados)

      return { ...response.data, dados }
    } catch (error) {
      console.error('Erro ao buscar extrato:', error)
      throw error
    }
  },

  getExtratoRelatorio: async (filters: FilterExtratoType, cpf: string) => {
    try {
      // Construir parâmetros apenas com valores válidos
      const params: Record<string, any> = {
        pageIndex: filters.pageIndex,
        pageSize: filters.pageSize
      }

      // Adicionar dataInicial se mês ou ano estiverem preenchidos
      if (filters.mesInicial || filters.anoInicial) {
        if (filters.mesInicial && filters.anoInicial) {
          params.dataInicial = `${filters.mesInicial}/${filters.anoInicial}`
        } else if (filters.mesInicial) {
          params.dataInicial = filters.mesInicial
        } else if (filters.anoInicial) {
          params.dataInicial = filters.anoInicial
        }
      }

      // Adicionar dataFinal se mês ou ano estiverem preenchidos
      if (filters.mesFinal || filters.anoFinal) {
        if (filters.mesFinal && filters.anoFinal) {
          params.dataFinal = `${filters.mesFinal}/${filters.anoFinal}`
        } else if (filters.mesFinal) {
          params.dataFinal = filters.mesFinal
        } else if (filters.anoFinal) {
          params.dataFinal = filters.anoFinal
        }
      }

      // Adicionar outros filtros apenas se estiverem preenchidos
      if (filters.tipo) params.tipo = filters.tipo
      if (filters.orgao) params.orgao = filters.orgao
      if (filters.autor) params.autor = filters.autor

      const response = await api.get(`/participante/${cpf}/extrato/pdf`, {
        params,
        responseType: 'blob',
        timeout: 120000,
        headers: {
          Accept: 'application/pdf'
        }
      })

      // Quando responseType é 'blob', o Axios retorna diretamente o blob
      if (!response || (response as any).size === 0) {
        throw new Error('Nenhum dado recebido do servidor')
      }

      return response
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      throw error
    }
  }
}
