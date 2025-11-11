import { useCallback, useState } from 'react'

import { PerfilInvestimentoService } from '@/services/PerfilInvestimentoService'
import type { HistoricoAlteracaoPerfilType } from '@/types/perfilInvestimento/HistoricoAlteracaoPerfilType'

export const useGetUltimaSolicitacao = () => {
  const [ultimaSolicitacao, setUltimaSolicitacao] = useState<HistoricoAlteracaoPerfilType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getUltimaSolicitacao = useCallback(async (cpf: string) => {
    try {
      const response = await PerfilInvestimentoService.getUltimaSolicitacaoAlteracaoPerfil(cpf)

      setUltimaSolicitacao(response as HistoricoAlteracaoPerfilType)
    } catch (error: any) {
      setError(error.message)

      return { success: false, message: error.message }
    }
  }, [])

  return { ultimaSolicitacao, getUltimaSolicitacao, error }
}
