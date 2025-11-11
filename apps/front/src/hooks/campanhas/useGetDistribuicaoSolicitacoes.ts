import { useCallback, useState } from 'react'

import { CampanhaService } from '@/services/CampanhaService'
import type { TotalDistribuicaoSolicitacoesType } from '@/types/campanhas/TotalDistribuicaoSolicitacoesType'
import type { CampanhaType } from '@/types/perfilInvestimento/CampanhaType'

export const useGetDistribuicaoSolicitacoes = () => {
  const [distribuicaoSolicitacoes, setDistribuicaoSolicitacoes] = useState<TotalDistribuicaoSolicitacoesType | null>(
    null
  )

  const [error, setError] = useState<string | null>(null)

  const getDistribuicaoSolicitacoes = useCallback(async (campanha: CampanhaType) => {
    try {
      const response = await CampanhaService.getDistribuicaoSolicitacoesCampanha(campanha.idCampanha as number)

      setDistribuicaoSolicitacoes(response)
    } catch (error) {
      setError(error as string)
      throw error
    }
  }, [])

  return { distribuicaoSolicitacoes, error, getDistribuicaoSolicitacoes }
}
