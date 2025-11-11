import { useCallback, useState } from 'react'

import { CampanhaService } from '@/services/CampanhaService'
import type { CampanhaResumoType } from '@/types/perfilInvestimento/CampanhaResumoType'

export const useGetResumoSolicitacoesCampanha = () => {
  const [resumo, setResumo] = useState<CampanhaResumoType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getResumoSolicitacoesCampanha = useCallback(async (idCampanha: number) => {
    try {
      const response = await CampanhaService.getResumoSolicitacoesCampanha(idCampanha)
  
      setResumo(response)
    } catch (error) {
      setError(error as string)
      throw error
    }
  }, [])

  return { resumo, error, getResumoSolicitacoesCampanha }
}
