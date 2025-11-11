import { useCallback, useState } from 'react'

import { PerfilInvestimentoService } from '@/services/PerfilInvestimentoService'

export const useMigrarPerfilIndividual = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const migrarPerfilIndividual = useCallback(async (solicitacaoId: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await PerfilInvestimentoService.postMigrarPerfilIndividual(solicitacaoId)

      
return response
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao migrar perfil'

      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { migrarPerfilIndividual, isLoading, error }
}
