import { useCallback, useState } from 'react'

import { CampanhaService } from '@/services/CampanhaService'
import type { MigracaoSolicitacoesType } from '@/types/campanhas/MigracaoSolicitacoesType'

export const useGetMigracaoSolicitacoesCampanha = () => {
  const [migracaoSolicitacoes, setMigracaoSolicitacoes] = useState<MigracaoSolicitacoesType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getMigracaoSolicitacoesCampanha = useCallback(async (idCampanha: number) => {
    try {
      const response = await CampanhaService.getMigracaoSolicitacoesCampanha(idCampanha)

      setMigracaoSolicitacoes(response)
    } catch (error) {
      setError(error as string)

      // throw error
    }
  }, [])

  return { migracaoSolicitacoes, error, getMigracaoSolicitacoesCampanha }
}
