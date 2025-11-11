import { useCallback, useState } from 'react'

import { PerfilInvestimentoService } from '@/services/PerfilInvestimentoService'
import type { FilterHistoricoAlteracaoPerfilInvestimentoType } from '@/types/perfilInvestimento/FilterHistoricoAlteracaoPerfilInvestimentoType'

export const useGetHistoricoSolicitacoes = () => {
  const [historicoSolicitacoes, setHistoricoSolicitacoes] =
    useState<FilterHistoricoAlteracaoPerfilInvestimentoType | null>(null)

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getHistoricoSolicitacoes = useCallback(async (cpf: string, pageIndex: number = 0, pageSize: number = 4) => {
    try {
      setIsLoading(true)
      const response = await PerfilInvestimentoService.getHistoricoSolicitacoes(cpf, pageIndex, pageSize)

      response.totalItems > 0 ? setHistoricoSolicitacoes(response) : setHistoricoSolicitacoes(null)
    } catch (error) {
      setError(error as string)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { historicoSolicitacoes, error, getHistoricoSolicitacoes, isLoading }
}
