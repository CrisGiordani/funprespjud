import { useState } from 'react'

import { PerfilInvestimentoService } from '@/services/PerfilInvestimentoService'

export const usePostSolicitarAlteracaoPerfil = () => {
  const [error, setError] = useState<string | null>(null)

  const postSolicitarAlteracaoPerfil = async (
    cpf: string,
    campanha: string | number,
    perfilInvestimento: number | string,
    dadosSimulacaoJson: string
  ) => {
    try {
      const response = await PerfilInvestimentoService.postSolicitarAlteracaoPerfil(
        cpf,
        campanha,
        perfilInvestimento,
        dadosSimulacaoJson
      )

      await PerfilInvestimentoService.postDispatchEmail(cpf, response.token)

      return response
    } catch (error) {
      setError(error as string)
    }
  }

  return { error, postSolicitarAlteracaoPerfil }
}
