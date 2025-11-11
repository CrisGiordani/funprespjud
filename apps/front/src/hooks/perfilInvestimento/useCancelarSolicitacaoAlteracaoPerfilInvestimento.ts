import { useCallback, useState } from 'react'

import { PerfilInvestimentoService } from '@/services/PerfilInvestimentoService'

export const useCancelarSolicitacaoAlteracaoPerfilInvestimento = () => {
  const [error, setError] = useState<string | null>(null)
  const [statusCancelamento, setStatusCancelamento] = useState<boolean>(false)

  const cancelarSolicitacaoAlteracaoPerfil = useCallback(async (cpf: string) => {
    try {
      const response = await PerfilInvestimentoService.putCancelarSolicitacaoAlteracaoPerfil(cpf)

      setStatusCancelamento(response)
    } catch (error) {
      setError(error as string)
      throw error
    }
  }, [])

  return { statusCancelamento, cancelarSolicitacaoAlteracaoPerfil, error }
}
