import { useState , useCallback } from 'react'

import { ContribuicoesService } from '@/services/ContribuicoesService'
import type { ContribuicaoDoMesResponseType } from '@/types/contribuicoes/contribuicoes.type'


export const useGetUltimaContribuicao = () => {
  const [ultimaContribuicao, setUltimaContribuicao] = useState<ContribuicaoDoMesResponseType | null>(null)

  const [error, setError] = useState<string | null>(null)

  const getUltimaContribuicao = useCallback(async (cpf: string) => {
    try {
      setError(null)
      const response = await ContribuicoesService.getContribuicaoDoMes({ participanteId: cpf })

      if (response) {
        setUltimaContribuicao(response)

        return { success: true, message: 'Contribuições encontradas' }

      }
      
      setError('Não há contribuições');
      
      return { success: false, message: 'Não há contribuições' }

    } catch (error) {
      setError(error as string)
    }
  }, [])

  return { ultimaContribuicao, getUltimaContribuicao, error }
}
