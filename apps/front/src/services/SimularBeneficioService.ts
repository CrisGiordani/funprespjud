import { api } from '@/lib/api'
import type { SimulacaoResponseType } from '@/types/simulacao-beneficio/ParametrosSimulacaoResponseType'
import type { ParametrosSimulacaoType } from '@/types/simulacao-beneficio/ParametrosSimulacaoType'

export const SimularBeneficioService = {
  simularBeneficio: async (parametros: ParametrosSimulacaoType): Promise<SimulacaoResponseType> => {
    try {
      const parametrosAPI = {
        idadeAposentadoria: parametros.idadeAposentadoria,
        rentabilidadeProjetada: parametros.rentabilidade,
        salarioParticipante: parametros.remuneracao,
        percentualContribuicaoNormal: parametros.contribuicaoNormal,
        percentualContribuicaoFacultativa: parametros.contribuicaoFacultativa,
        aporteExtraordinario: parametros.aporteExtra,
        prazoRecebimento: parametros.prazoBeneficio,
        saqueReserva: parametros.saqueReserva,
        baseContribuicaoFunpresp: parametros.baseContribuicao
      }

      const response = await api.post(`/simulacoes/parametros/${parametros.cpf}`, {
        dados: parametrosAPI
      })

      return response as unknown as SimulacaoResponseType
    } catch (error) {
      throw error
    }
  }
}
