import type { StatusHistoricoEnum } from '@/enum/perfilInvestimento/StatusHistoricoEnum'
import { api, apiNode } from '../lib/api'
import type { AppStatusType } from '@/types/perfilInvestimento/AppStatusType'
import type { CampanhaType } from '@/types/perfilInvestimento/CampanhaType'
import type { CienteCampanhaAbertaType } from '@/types/perfilInvestimento/CienteCampanhaAbertaType'
import type { FilterHistoricoAlteracaoPerfilInvestimentoType } from '@/types/perfilInvestimento/FilterHistoricoAlteracaoPerfilInvestimentoType'
import type { FilterHistoricoRespostasType } from '@/types/perfilInvestimento/FilterHistoricoRespostasType'
import type { HistoricoAlteracaoPerfilType } from '@/types/perfilInvestimento/HistoricoAlteracaoPerfilType'
import type { HistoricoType } from '@/types/perfilInvestimento/HistoricoType'
import type { PerfilInvestimentoType } from '@/types/perfilInvestimento/PerfilInvestimentoType'
import type { QuestionarioType } from '@/types/perfilInvestimento/QuestionarioType'

export const PerfilInvestimentoService = {
  getQuestionario: async () => {
    try {
      const response = await api.get<QuestionarioType | null>('/questionario/1')

      return response.data
    } catch (error) {
      throw error
    }
  },

  salvarRespostas: async (cpf: string, respostas: any[]) => {
    try {
      const response = await api.post(`/questionario/respostas/${cpf}`, { respostas })

      return response.data
    } catch (error) {
      throw error
    }
  },

  getHistorico: async (cpf: string, pageIndex: number, pageSize: number) => {
    try {
      const response = await api.get<FilterHistoricoRespostasType>(`/questionario/${cpf}/historico`, {
        params: {
          pageIndex: pageIndex,
          pageSize: pageSize
        }
      })

      return response.data
    } catch (error) {
      throw error
    }
  },

  getUltimaRespostaHistorico: async (cpf: string) => {
    try {
      const response = await api.get<HistoricoType>(`/questionario/${cpf}/ultima-resposta`)
      const ultimaResposta = response.data

      return ultimaResposta ? ultimaResposta : null
    } catch (error) {
      throw error
    }
  },

  getCampanhaAtiva: async () => {
    try {
      const response = await api.get<CampanhaType>('/campanhas/campanha-ativa')

      return response.data
    } catch (error) {
      throw error
    }
  },

  getHistoricoSolicitacoes: async (cpf: string, pageIndex: number, pageSize: number) => {
    try {
      const response = await api.get<FilterHistoricoAlteracaoPerfilInvestimentoType>(
        `/perfil-investimento/historico-solicitacoes-alteracao-perfil/${cpf}`,
        {
          params: {
            pageIndex: pageIndex,
            pageSize: pageSize
          }
        }
      )

      return response.data
    } catch (error) {
      throw error
    }
  },

  postGerarTermos: async (cpf: string, status: StatusHistoricoEnum) => {
    try {
      const response = await api.post(`/perfil-investimento/relatorio/${cpf}`, { status })

      return response.data
    } catch (error) {
      throw error
    }
  },

  getPerfilAtual: async (cpf: string) => {
    try {
      const response = await api.get<PerfilInvestimentoType>(`/perfil-investimento/${cpf}/perfil-atual`)

      return response.data
    } catch (error: any) {
      return error.response.data

      // throw error
    }
  },

  getPerfilIndicado: async (cpf: string) => {
    try {
      const response = await api.get<PerfilInvestimentoType>(`/perfil-investimento/${cpf}/perfil-indicado`)

      return response.data
    } catch (error) {
      throw error
    }
  },

  getPerfilSolicitado: async (cpf: string) => {
    try {
      const response = await api.get<PerfilInvestimentoType>(`/perfil-investimento/${cpf}/buscar-perfil-solicitado`)

      return response.data
    } catch (error) {
      throw error
    }
  },

  getUltimaSolicitacaoAlteracaoPerfil: async (cpf: string) => {
    try {
      const response = await api.get<HistoricoAlteracaoPerfilType | null>(
        `/perfil-investimento/${cpf}/ultima-solicitacao-alteracao-perfil`
      )

      return response.data ? response.data : []
    } catch (error) {
      throw error
    }
  },

  getStatusApp: async (cpf: string) => {
    try {
      const response = await api.get<AppStatusType>(`/questionario/${cpf}/status-app`)

      return response.data
    } catch (error) {
      throw error
    }
  },

  postSolicitarAlteracaoPerfil: async (
    cpf: string,
    campanha: string | number,
    perfilInvestimento: number | string,
    dadosSimulacaoJson: string
  ) => {
    try {
      const response = await api.post(`/perfil-investimento/${cpf}/perfil-solicitacao-alteracao`, {
        perfilInvestimento: perfilInvestimento,
        campanha: campanha,
        dadosSimulacaoJson: dadosSimulacaoJson
      })

      return response.data
    } catch (error) {
      throw error
    }
  },

  postDispatchEmail: async (cpf: string, token: string) => {
    try {
      const response = await apiNode.post(`/users/dispatch-email`, { cpf: cpf, token: token })

      return response.data
    } catch (error) {
      throw error
    }
  },

  postVerificarToken: async (cpf: string, token: string) => {
    try {
      const response = await api.post(`/perfil-investimento/${cpf}/verificar-token`, { token })

      return response.data
    } catch (error) {
      throw error
    }
  },

  getGerarNovoToken: async (cpf: string) => {
    try {
      const response = await api.get(`/perfil-investimento/${cpf}/gerar-novo-token`)

      return response.data
    } catch (error) {
      throw error
    }
  },

  putCancelarSolicitacaoAlteracaoPerfil: async (cpf: string) => {
    try {
      const response = await api.put(`/perfil-investimento/${cpf}/cancelar-solicitacao-alteracao-perfil`)

      return response.data
    } catch (error) {
      throw error
    }
  },

  postMigrarPerfilIndividual: async (solicitacaoId: number) => {
    try {
      const response = await api.post(`/perfil-investimento/migrar-perfil-individual/${solicitacaoId}`)

      return response.data
    } catch (error) {
      throw error
    }
  },

  getCienteCampanhaAberta: async (cpf: string): Promise<CienteCampanhaAbertaType> => {
    try {
      const response = await api.get<CienteCampanhaAbertaType>(`/perfil-investimento/${cpf}/ciente-campanha-aberta`)

      return response.data
    } catch (error) {
      throw error
    }
  },

  postCienteCampanhaAberta: async (cpf: string): Promise<CienteCampanhaAbertaType> => {
    try {
      const response = await api.post<CienteCampanhaAbertaType>(`/perfil-investimento/${cpf}/ciente-campanha-aberta`)

      return response.data
    } catch (error) {
      throw error
    }
  }
}
