import { api } from '@/lib/api'
import type {
  ContribuicaoDoMesResponseType,
  ContribuicaoDoMesType,
  ContribuicaoResponseType,
  ContribuicoesType,
  PercentualContribuicaoResponseType,
  PercentualContribuicaoType
} from '@/types/contribuicoes/contribuicoes.type'

export const ContribuicoesService = {
  getContribuicoes: async ({ participanteId, filters }: ContribuicoesType) => {
    try {
      const response = await api.get<ContribuicaoResponseType[]>(`/participantes/${participanteId}/contribuicoes`, {
        params: {
          pageIndex: filters?.pageIndex,
          pageSize: filters?.pageSize,
          dataInicial: filters?.dataInicial,
          dataFinal: filters?.dataFinal,
          tipo: filters?.tipo,
          orgao: filters?.orgao,
          autor: filters?.autor
        }
      })

      return response.data
    } catch (error) {
      console.error('Erro ao buscar contribuições:', error)
      throw error
    }
  },
  getContribuicaoDoMes: async ({ participanteId }: ContribuicaoDoMesType) => {
    try {
      const response = await api.get<ContribuicaoDoMesResponseType>(
        `/participantes/${participanteId}/contribuicoes-mes-ano`
      )

      response.data.nomeMes = new Date(response.data.dataUltimoAporte).toLocaleString('pt-BR', {
        month: 'long'
      })

      return response.data
    } catch (error) {
      console.error('Erro ao buscar contribuições:', error)
      throw error
    }
  },
  getPercentualContribuicao: async ({ participanteId }: PercentualContribuicaoType) => {
    try {
      const response = await api.get<PercentualContribuicaoResponseType>(
        `/participantes/${participanteId}/percentual-contribuicao`
      )

      return response.data
    } catch (error) {
      console.error('Erro ao buscar Percentual de Contribuição:', error)
      throw error
    }
  }
}
