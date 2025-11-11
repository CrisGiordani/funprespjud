import { formatarDataISO } from '@/app/utils/formatters'
import { api, apiNode } from '@/lib/api'
import type { MigracaoSolicitacoesType } from '@/types/campanhas/MigracaoSolicitacoesType'
import type { TotalDistribuicaoSolicitacoesType } from '@/types/campanhas/TotalDistribuicaoSolicitacoesType'
import type { CampanhaResumoType } from '@/types/perfilInvestimento/CampanhaResumoType'
import type { CampanhaResponseType, CampanhaType } from '@/types/perfilInvestimento/CampanhaType'

export const CampanhaService = {
  getCampanhas: async (pageIndex: number = 0, pageSize: number = 4) => {
    const response = await api.get(`/campanhas?pageIndex=${pageIndex}&pageSize=${pageSize}`)

    return response.data
  },

  postCampanhaPerfilInvestimento: async (campanha: CampanhaType): Promise<CampanhaResponseType> => {
    const response = await api.post('/campanhas', campanha)

    return response.data
  },

  putCampanhaPerfilInvestimento: async (campanha: CampanhaType): Promise<CampanhaResponseType> => {
    const response = await api.put(`/campanhas/editar-campanha/${campanha.idCampanha}`, campanha)

    return response.data
  },

  deleteCampanhaPerfilInvestimento: async (campanha: CampanhaType): Promise<CampanhaResponseType> => {
    const response = await api.delete(`/campanhas/${campanha.idCampanha}`)

    return response.data
  },

  getTotalParticipantes: async (campanha: CampanhaType): Promise<any> => {
    const dtFim = formatarDataISO(campanha.dt_fim)

    if (!dtFim) {
      throw new Error('Data de fim inválida')
    }

    const response = await apiNode.get(`/users/campanha-perfil-investimento/total-participantes?dtFim=${dtFim}`)

    return response.data
  },

  getResumoSolicitacoesCampanha: async (idCampanha: number): Promise<CampanhaResumoType> => {
    const response = await api.get<CampanhaResumoType>(`/campanhas/resumo/${idCampanha}`)

    return response.data
  },

  getDistribuicaoSolicitacoesCampanha: async (idCampanha: number): Promise<TotalDistribuicaoSolicitacoesType> => {
    const response = await api.get<TotalDistribuicaoSolicitacoesType>(`/campanhas/distribuicao/${idCampanha}`)

    return response.data
  },

  getMigracaoSolicitacoesCampanha: async (idCampanha: number): Promise<MigracaoSolicitacoesType> => {
    const response = await api.get<MigracaoSolicitacoesType>(`/campanhas/migracao-perfil-investimento/${idCampanha}`)

    return response.data
  }
}
